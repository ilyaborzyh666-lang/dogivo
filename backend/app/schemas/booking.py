from datetime import datetime
from pydantic import BaseModel, model_validator

from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    walker_id: int
    scheduled_start: datetime
    scheduled_end: datetime
    dog_name: str
    dog_breed: str | None = None
    notes: str | None = None

    @model_validator(mode="after")
    def end_after_start(self):
        if self.scheduled_end <= self.scheduled_start:
            raise ValueError("scheduled_end must be after scheduled_start")
        return self


class BookingUpdate(BaseModel):
    status: BookingStatus | None = None
    notes: str | None = None


class BookingOut(BaseModel):
    id: int
    owner_id: int
    walker_id: int
    status: BookingStatus
    scheduled_start: datetime
    scheduled_end: datetime
    actual_start: datetime | None
    actual_end: datetime | None
    dog_name: str
    dog_breed: str | None
    notes: str | None
    total_price: float
    created_at: datetime
    has_review: bool = False

    model_config = {"from_attributes": True}

    @model_validator(mode="before")
    @classmethod
    def populate_has_review(cls, data):
        if not isinstance(data, dict) and hasattr(data, "review"):
            return {
                **{c.key: getattr(data, c.key) for c in data.__table__.columns},
                "has_review": data.review is not None,
            }
        return data
