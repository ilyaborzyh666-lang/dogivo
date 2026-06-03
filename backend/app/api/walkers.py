from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db, require_walker
from app.models.user import User, UserRole
from app.schemas.walker import WalkerProfileOut, WalkerProfileUpdate, WalkerSearchResult
from app.services.walker_service import (
    create_walker_profile,
    get_walker_profile,
    search_walkers,
    update_walker_profile,
)

router = APIRouter(prefix="/walkers", tags=["walkers"])


@router.get("/search", response_model=list[WalkerSearchResult])
async def search(
    city: str | None = Query(None),
    lat: float | None = Query(None),
    lon: float | None = Query(None),
    max_price: float | None = Query(None),
    limit: int = Query(20, le=50),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
):
    return await search_walkers(db, city=city, lat=lat, lon=lon, max_price=max_price, limit=limit, offset=offset)


@router.get("/me", response_model=WalkerProfileOut | None)
async def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_walker_profile(db, current_user.id)


@router.post("/me", response_model=WalkerProfileOut, status_code=status.HTTP_201_CREATED)
async def create_my_profile(
    data: WalkerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if await get_walker_profile(db, current_user.id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Walker profile already exists")
    current_user.role = UserRole.WALKER
    profile = await create_walker_profile(db, current_user.id)
    return await update_walker_profile(db, profile, data)


@router.patch("/me", response_model=WalkerProfileOut)
async def update_my_profile(
    data: WalkerProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    profile = await get_walker_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Walker profile not found")
    return await update_walker_profile(db, profile, data)


@router.get("/{walker_user_id}", response_model=WalkerProfileOut)
async def get_walker(walker_user_id: int, db: AsyncSession = Depends(get_db)):
    profile = await get_walker_profile(db, walker_user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Walker not found")
    return profile
