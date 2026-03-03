from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/{listing_id}", response_model=schemas.CarListingResponse)
def get_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = (
        db.query(models.CarListing).filter(models.CarListing.id == listing_id).first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


@router.put("/{listing_id}", response_model=schemas.CarListingResponse)
def update_listing(
    listing_id: str,
    updated_data: schemas.CarListingUpdate,
    db: Session = Depends(get_db),
):
    listing = (
        db.query(models.CarListing).filter(models.CarListing.id == listing_id).first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    for key, value in updated_data.model_dump().items():
        setattr(listing, key, value)

    db.commit()
    db.refresh(listing)

    return listing


@router.delete("/{listing_id}", status_code=204)
def delete_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = (
        db.query(models.CarListing).filter(models.CarListing.id == listing_id).first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    db.delete(listing)
    db.commit()

    return {"detail": "Listing deleted succesfully"}
