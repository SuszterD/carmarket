from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from uuid import uuid4
from .database import Base


class CarListing(Base):
    __tablename__ = "car_listings"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)
    mileage = Column(Integer, nullable=False)
    fuel_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
