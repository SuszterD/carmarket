from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from enum import Enum

CURRENT_YEAR = datetime.now().year


class FuelType(str, Enum):
    PETROL = "Benzin"
    GAS = "Gázolaj"
    HYBRID = "Hybrid"


class CarListingBase(BaseModel):
    brand: str = Field(min_length=1, max_length=50)
    model: str = Field(min_length=1, max_length=50)
    year: int = Field(ge=1900, le=CURRENT_YEAR + 1)
    price: int = Field(ge=0)
    mileage: int = Field(ge=0)
    fuel_type: FuelType
    description: str = Field(min_length=1, max_length=500)


class CarListingCreate(CarListingBase):
    pass


class CarListingResponse(CarListingBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CarListingUpdate(CarListingBase):
    pass


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(min_length=6, max_length=12)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=72)


class UserResponse(UserBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str
