from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.booking import BookingStatus
from app.models.user import User, UserRole
from app.schemas.booking import BookingCreate, BookingOut, BookingUpdate
from app.schemas.review import ReviewCreate, ReviewOut
from app.services.booking_service import create_booking, get_booking, get_user_bookings, update_booking_status
from app.services.walker_service import update_walker_rating

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("/", response_model=list[BookingOut])
async def list_bookings(
    as_walker: bool = False,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_user_bookings(db, current_user.id, as_owner=not as_walker)


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
async def create(
    data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        return await create_booking(db, current_user.id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{booking_id}", response_model=BookingOut)
async def get(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    booking = await get_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.owner_id != current_user.id and booking.walker_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return booking


@router.patch("/{booking_id}/status", response_model=BookingOut)
async def update_status(
    booking_id: int,
    data: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    booking = await get_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    is_owner = booking.owner_id == current_user.id
    is_walker = booking.walker_id == current_user.id

    if not is_owner and not is_walker:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    # Owners can cancel; walkers can confirm/start/complete
    if data.status == BookingStatus.CANCELLED and not is_owner:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only owner can cancel")
    if data.status in (BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED) and not is_walker:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only walker can update walk status")

    return await update_booking_status(db, booking, data.status)


@router.post("/{booking_id}/review", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def leave_review(
    booking_id: int,
    data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.models.review import Review
    from sqlalchemy import select

    booking = await get_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner can leave a review")
    if booking.status != BookingStatus.COMPLETED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can only review completed bookings")

    existing_review = await db.execute(select(Review).where(Review.booking_id == booking_id))
    if existing_review.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Review already exists")

    review = Review(
        booking_id=booking_id,
        reviewer_id=current_user.id,
        walker_id=booking.walker_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    await db.flush()
    await update_walker_rating(db, booking.walker_id)
    return review
