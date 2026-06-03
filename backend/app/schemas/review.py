from datetime import datetime
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    booking_id: int
    reviewer_id: int
    walker_id: int
    rating: int
    comment: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
