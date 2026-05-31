import math
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.walker import WalkerProfile
from app.models.user import User
from app.schemas.walker import WalkerProfileUpdate, WalkerSearchResult


async def get_walker_profile(db: AsyncSession, user_id: int) -> WalkerProfile | None:
    result = await db.execute(
        select(WalkerProfile)
        .where(WalkerProfile.user_id == user_id)
        .options(selectinload(WalkerProfile.user))
    )
    return result.scalar_one_or_none()


async def create_walker_profile(db: AsyncSession, user_id: int) -> WalkerProfile:
    profile = WalkerProfile(user_id=user_id)
    db.add(profile)
    await db.flush()
    return profile


async def update_walker_profile(db: AsyncSession, profile: WalkerProfile, data: WalkerProfileUpdate) -> WalkerProfile:
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(profile, field, value)
    await db.flush()
    return profile


async def search_walkers(
    db: AsyncSession,
    city: str | None = None,
    lat: float | None = None,
    lon: float | None = None,
    max_price: float | None = None,
    limit: int = 20,
    offset: int = 0,
) -> list[WalkerSearchResult]:
    query = (
        select(WalkerProfile, User)
        .join(User, WalkerProfile.user_id == User.id)
        .where(WalkerProfile.is_available == True, User.is_active == True)
    )
    if city:
        query = query.where(WalkerProfile.city.ilike(f"%{city}%"))
    if max_price:
        query = query.where(WalkerProfile.price_per_hour <= max_price)

    query = query.order_by(WalkerProfile.rating.desc()).limit(limit).offset(offset)
    rows = await db.execute(query)

    results = []
    for profile, user in rows.all():
        distance = None
        if lat and lon and profile.latitude and profile.longitude:
            distance = _haversine(lat, lon, profile.latitude, profile.longitude)
        results.append(WalkerSearchResult(
            id=profile.id,
            user_id=user.id,
            full_name=user.full_name,
            avatar_url=user.avatar_url,
            bio=profile.bio,
            price_per_hour=float(profile.price_per_hour),
            city=profile.city,
            rating=profile.rating,
            total_reviews=profile.total_reviews,
            is_available=profile.is_available,
            distance_km=round(distance, 1) if distance is not None else None,
        ))
    return results


def _haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


async def update_walker_rating(db: AsyncSession, walker_user_id: int) -> None:
    from sqlalchemy import func
    from app.models.review import Review
    result = await db.execute(
        select(func.avg(Review.rating), func.count(Review.id))
        .where(Review.walker_id == walker_user_id)
    )
    avg_rating, count = result.one()
    profile = await get_walker_profile(db, walker_user_id)
    if profile:
        profile.rating = round(float(avg_rating or 0), 2)
        profile.total_reviews = count
        await db.flush()
