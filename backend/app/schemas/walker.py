from datetime import datetime
from pydantic import BaseModel

from app.schemas.user import UserOut
from app.schemas.review import ReviewOut


class WalkerProfileUpdate(BaseModel):
    bio: str | None = None
    price_per_hour: float | None = None
    city: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    is_available: bool | None = None
    years_experience: int | None = None


class WalkerProfileOut(BaseModel):
    id: int
    user_id: int
    bio: str | None
    price_per_hour: float
    city: str | None
    latitude: float | None
    longitude: float | None
    rating: float
    total_reviews: int
    is_available: bool
    years_experience: int
    created_at: datetime
    user: UserOut
    reviews: list[ReviewOut] = []

    model_config = {"from_attributes": True}


class WalkerSearchResult(BaseModel):
    id: int
    user_id: int
    full_name: str
    avatar_url: str | None
    bio: str | None
    price_per_hour: float
    city: str | None
    rating: float
    total_reviews: int
    is_available: bool
    distance_km: float | None = None
