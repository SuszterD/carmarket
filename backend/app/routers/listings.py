from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.post("/", response_model=schemas.CarListingResponse)
def create_listing(
    listing: schemas.CarListingCreate,
    db: Session = Depends(get_db),
):
    db_listing = models.CarListing(**listing.model_dump())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing


@router.get("/", response_model=List[schemas.CarListingResponse])
def get_listings(db: Session = Depends(get_db)):
    return db.query(models.CarListing).all()
