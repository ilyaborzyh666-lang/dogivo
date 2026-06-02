from datetime import timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as aioredis

from app.core.config import get_settings
from app.core.deps import get_current_user, get_db
from app.core.redis import get_redis

_oauth2 = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.token_store import (
    save_refresh_token,
    is_refresh_token_valid,
    revoke_refresh_token,
    blacklist_access_token,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, GoogleAuthRequest, FirebaseAuthRequest
from app.schemas.user import UserCreate, UserOut
from app.services.user_service import get_user_by_email, get_user_by_google_id, create_user, create_oauth_user

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

_ACCESS_TTL = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
_REFRESH_TTL = settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400


async def _issue_tokens(redis: aioredis.Redis, user_id: int) -> TokenResponse:
    access = create_access_token(user_id)
    refresh = create_refresh_token(user_id)
    await save_refresh_token(redis, user_id, refresh, ttl_seconds=_REFRESH_TTL)
    return TokenResponse(access_token=access, refresh_token=refresh)


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    if await get_user_by_email(db, data.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    return await create_user(db, data)


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    user = await get_user_by_email(db, data.email)
    if not user or not user.hashed_password or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")
    return await _issue_tokens(redis, user.id)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    data: RefreshRequest,
    redis: aioredis.Redis = Depends(get_redis),
):
    try:
        payload = decode_token(data.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        user_id = int(payload["sub"])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if not await is_refresh_token_valid(redis, user_id, data.refresh_token):
        # Token reuse detected — revoke everything (possible theft)
        await revoke_refresh_token(redis, user_id)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token already used or revoked")

    return await _issue_tokens(redis, user_id)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    token: str = Depends(_oauth2),
    current_user: User = Depends(get_current_user),
    redis: aioredis.Redis = Depends(get_redis),
):
    try:
        payload = decode_token(token)
        jti = payload.get("jti")
        exp = payload.get("exp")
        if jti and exp:
            from datetime import datetime
            ttl = int(exp - datetime.now(timezone.utc).timestamp())
            if ttl > 0:
                await blacklist_access_token(redis, jti, ttl_seconds=ttl)
    except JWTError:
        pass
    await revoke_refresh_token(redis, current_user.id)


@router.post("/google", response_model=TokenResponse)
async def google_auth(
    data: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    try:
        id_info = id_token.verify_oauth2_token(
            data.id_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    google_id = id_info["sub"]
    email = id_info["email"]
    full_name = id_info.get("name", email)
    avatar_url = id_info.get("picture")

    # Need db session for user lookup
    from app.db.session import AsyncSessionLocal
    async with AsyncSessionLocal() as db_session:
        user = await get_user_by_google_id(db_session, google_id) or await get_user_by_email(db_session, email)
        if not user:
            user = await create_oauth_user(db_session, email=email, full_name=full_name, google_id=google_id, avatar_url=avatar_url)
        elif not user.google_id:
            user.google_id = google_id
        await db_session.commit()
        user_id = user.id

    return await _issue_tokens(redis, user_id)


@router.post("/firebase", response_model=TokenResponse)
async def firebase_auth(
    data: FirebaseAuthRequest,
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    try:
        from app.core.firebase_admin import verify_firebase_token
        decoded = verify_firebase_token(data.id_token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Firebase token")

    firebase_uid = decoded["uid"]
    email = decoded.get("email", "")
    full_name = decoded.get("name", email)
    avatar_url = decoded.get("picture")

    from app.db.session import AsyncSessionLocal
    async with AsyncSessionLocal() as db_session:
        user = await get_user_by_google_id(db_session, firebase_uid) or await get_user_by_email(db_session, email)
        if not user:
            user = await create_oauth_user(
                db_session, email=email, full_name=full_name,
                google_id=firebase_uid, avatar_url=avatar_url,
            )
        elif not user.google_id:
            user.google_id = firebase_uid
        await db_session.commit()
        user_id = user.id

    return await _issue_tokens(redis, user_id)
