from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..core.security import get_current_user
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/listings", tags=["Listings"])


@router.post("", response_model=schemas.CarListingResponse, status_code=201)
def create_listing(
    listing: schemas.CarListingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db_listing = models.CarListing(**listing.model_dump(), user_id=current_user.id)
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)

    return db_listing


@router.get("", response_model=schemas.PaginatedListingsResponse)
def get_listings(
    page: int = Query(default=1, ge=1),
    page_size: schemas.PageSize = Query(default=schemas.PageSize.SMALL),
    db: Session = Depends(get_db),
):
    skip = (page - 1) * page_size
    total = db.query(models.CarListing).count()

    response = {
        "items": db.query(models.CarListing).offset(skip).limit(page_size).all(),
        "total": total,
        "page": page,
        "page_size": page_size,
    }

    return response


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
    current_user: models.User = Depends(get_current_user),
):
    listing = (
        db.query(models.CarListing).filter(models.CarListing.id == listing_id).first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to modify this listing"
        )

    for key, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(listing, key, value)

    db.commit()
    db.refresh(listing)

    return listing


@router.delete("/{listing_id}", status_code=204)
def delete_listing(
    listing_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    listing = (
        db.query(models.CarListing).filter(models.CarListing.id == listing_id).first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this listing"
        )

    db.delete(listing)
    db.commit()

    return None
