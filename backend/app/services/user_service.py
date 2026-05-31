from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate


async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_google_id(db: AsyncSession, google_id: str) -> User | None:
    result = await db.execute(select(User).where(User.google_id == google_id))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, data: UserCreate, role: UserRole = UserRole.OWNER) -> User:
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        phone=data.phone,
        role=role,
    )
    db.add(user)
    await db.flush()
    return user


async def create_oauth_user(db: AsyncSession, email: str, full_name: str, google_id: str, avatar_url: str | None = None) -> User:
    user = User(
        email=email,
        full_name=full_name,
        google_id=google_id,
        avatar_url=avatar_url,
        is_verified=True,
        role=UserRole.OWNER,
    )
    db.add(user)
    await db.flush()
    return user


async def update_user(db: AsyncSession, user: User, data: UserUpdate) -> User:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    await db.flush()
    return user
