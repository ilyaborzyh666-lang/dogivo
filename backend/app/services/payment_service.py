import stripe
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.booking import Booking
from app.models.payment import Payment, PaymentStatus
from app.schemas.payment import CreatePaymentIntentResponse

settings = get_settings()


async def create_payment_intent(db: AsyncSession, booking: Booking) -> CreatePaymentIntentResponse:
    stripe.api_key = settings.STRIPE_SECRET_KEY
    amount_cents = int(float(booking.total_price) * 100)

    intent = stripe.PaymentIntent.create(
        amount=amount_cents,
        currency="ils",
        metadata={"booking_id": booking.id},
    )

    payment = Payment(
        booking_id=booking.id,
        stripe_payment_intent_id=intent.id,
        amount=booking.total_price,
        currency="ILS",
        status=PaymentStatus.PENDING,
    )
    db.add(payment)
    await db.flush()

    return CreatePaymentIntentResponse(
        client_secret=intent.client_secret,
        payment_intent_id=intent.id,
    )


async def handle_webhook(db: AsyncSession, payload: bytes, sig_header: str) -> None:
    stripe.api_key = settings.STRIPE_SECRET_KEY
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError):
        raise ValueError("Invalid webhook signature")

    if event["type"] == "payment_intent.succeeded":
        intent_id = event["data"]["object"]["id"]
        result = await db.execute(
            select(Payment).where(Payment.stripe_payment_intent_id == intent_id)
        )
        payment = result.scalar_one_or_none()
        if payment:
            payment.status = PaymentStatus.SUCCEEDED
            await db.flush()

    elif event["type"] == "payment_intent.payment_failed":
        intent_id = event["data"]["object"]["id"]
        result = await db.execute(
            select(Payment).where(Payment.stripe_payment_intent_id == intent_id)
        )
        payment = result.scalar_one_or_none()
        if payment:
            payment.status = PaymentStatus.FAILED
            await db.flush()
