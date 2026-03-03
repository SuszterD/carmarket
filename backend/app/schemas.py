from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CarListingBase(BaseModel):
    brand: str
    model: str
    year: int
    price: int
    mileage: int
    fuel_type: str
    description: str


class CarListingCreate(CarListingBase):
    pass


class CarListingResponse(CarListingBase):
    id: str
    created_at: datetime

    class config:
        from_attributes = True


class CarListingUpdate(CarListingBase):
    pass
