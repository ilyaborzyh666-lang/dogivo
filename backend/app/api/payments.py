from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.payment import CreatePaymentIntentRequest, CreatePaymentIntentResponse
from app.services.booking_service import get_booking
from app.services.payment_service import create_payment_intent, handle_webhook

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/intent", response_model=CreatePaymentIntentResponse)
async def create_intent(
    data: CreatePaymentIntentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    booking = await get_booking(db, data.booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return await create_payment_intent(db, booking)


@router.post("/webhook")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    try:
        await handle_webhook(db, payload, sig_header)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return {"status": "ok"}
