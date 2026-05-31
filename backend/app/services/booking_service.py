from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.booking import Booking, BookingStatus
from app.models.walker import WalkerProfile
from app.schemas.booking import BookingCreate


async def get_booking(db: AsyncSession, booking_id: int) -> Booking | None:
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    return result.scalar_one_or_none()


async def get_user_bookings(db: AsyncSession, user_id: int, as_owner: bool = True) -> list[Booking]:
    if as_owner:
        condition = Booking.owner_id == user_id
    else:
        condition = Booking.walker_id == user_id
    result = await db.execute(
        select(Booking).where(condition).order_by(Booking.scheduled_start.desc())
    )
    return list(result.scalars().all())


async def create_booking(db: AsyncSession, owner_id: int, data: BookingCreate) -> Booking:
    walker_result = await db.execute(
        select(WalkerProfile).where(WalkerProfile.user_id == data.walker_id)
    )
    walker_profile = walker_result.scalar_one_or_none()
    if not walker_profile:
        raise ValueError("Walker profile not found")

    duration_hours = (data.scheduled_end - data.scheduled_start).total_seconds() / 3600
    total_price = float(walker_profile.price_per_hour) * duration_hours

    booking = Booking(
        owner_id=owner_id,
        walker_id=data.walker_id,
        scheduled_start=data.scheduled_start,
        scheduled_end=data.scheduled_end,
        dog_name=data.dog_name,
        dog_breed=data.dog_breed,
        notes=data.notes,
        total_price=total_price,
    )
    db.add(booking)
    await db.flush()
    return booking


async def update_booking_status(db: AsyncSession, booking: Booking, status: BookingStatus) -> Booking:
    booking.status = status
    if status == BookingStatus.IN_PROGRESS:
        booking.actual_start = datetime.now(timezone.utc)
    elif status == BookingStatus.COMPLETED:
        booking.actual_end = datetime.now(timezone.utc)
    await db.flush()
    return booking
