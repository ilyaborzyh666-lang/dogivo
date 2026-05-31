from datetime import datetime
from pydantic import BaseModel

from app.models.payment import PaymentStatus


class PaymentOut(BaseModel):
    id: int
    booking_id: int
    stripe_payment_intent_id: str | None
    amount: float
    currency: str
    status: PaymentStatus
    created_at: datetime

    model_config = {"from_attributes": True}


class CreatePaymentIntentRequest(BaseModel):
    booking_id: int


class CreatePaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
