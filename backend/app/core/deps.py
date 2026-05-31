from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as aioredis

from app.core.security import decode_token
from app.core.redis import get_redis
from app.core.token_store import is_access_token_blacklisted
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services.user_service import get_user_by_id

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise credentials_exception
        user_id: str = payload.get("sub")
        jti: str = payload.get("jti")
        if not user_id or not jti:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    if await is_access_token_blacklisted(redis, jti):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")

    user = await get_user_by_id(db, int(user_id))
    if user is None:
        raise credentials_exception
    return user


async def require_walker(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in (UserRole.WALKER, UserRole.ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Walker access required")
    return current_user


async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user
