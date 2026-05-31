"""
Redis-backed token store for:
- refresh token rotation: each user has exactly one valid refresh token
- access token blacklist: revoked on logout
"""
import redis.asyncio as aioredis
from app.core.config import get_settings

settings = get_settings()

_REFRESH_KEY = "refresh:{user_id}"
_BLACKLIST_KEY = "blacklist:{jti}"


async def save_refresh_token(redis: aioredis.Redis, user_id: int, token: str, ttl_seconds: int) -> None:
    """Store the current valid refresh token for a user. Overwrites any previous one."""
    await redis.setex(_REFRESH_KEY.format(user_id=user_id), ttl_seconds, token)


async def is_refresh_token_valid(redis: aioredis.Redis, user_id: int, token: str) -> bool:
    stored = await redis.get(_REFRESH_KEY.format(user_id=user_id))
    return stored == token


async def revoke_refresh_token(redis: aioredis.Redis, user_id: int) -> None:
    await redis.delete(_REFRESH_KEY.format(user_id=user_id))


async def blacklist_access_token(redis: aioredis.Redis, jti: str, ttl_seconds: int) -> None:
    """Blacklist an access token until its natural expiry."""
    await redis.setex(_BLACKLIST_KEY.format(jti=jti), ttl_seconds, "1")


async def is_access_token_blacklisted(redis: aioredis.Redis, jti: str) -> bool:
    return await redis.exists(_BLACKLIST_KEY.format(jti=jti)) == 1
