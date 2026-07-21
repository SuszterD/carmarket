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
    brand: str | None = Query(default=None),
    fuel_type: schemas.FuelType | None = Query(default=None),
    year_min: int | None = Query(default=None, ge=1900, le=schemas.CURRENT_YEAR + 1),
    year_max: int | None = Query(default=None, ge=1900, le=schemas.CURRENT_YEAR + 1),
    price_min: int | None = Query(default=None, ge=0),
    price_max: int | None = Query(default=None, ge=0),
    sort_by: schemas.SortBy | None = Query(default=None),
    order: schemas.Order | None = Query(default=None),
):
    if year_min is not None and year_max is not None:
        if year_min > year_max:
            raise HTTPException(
                status_code=422, detail="year_min cannot be greater than year_max"
            )

    if price_min is not None and price_max is not None:
        if price_min > price_max:
            raise HTTPException(
                status_code=422, detail="price_min cannot be greater than price_max"
            )

    if sort_by is None:
        sort_by = schemas.SortBy.CREATED_AT
        if order is None:
            order = schemas.Order.DESC
    elif order is None:
        order = schemas.Order.ASC

    query = db.query(models.CarListing)

    if brand is not None:
        query = query.filter(models.CarListing.brand.ilike(f"%{brand}%"))

    if fuel_type is not None:
        query = query.filter(models.CarListing.fuel_type == fuel_type)

    if year_min is not None:
        query = query.filter(models.CarListing.year >= year_min)

    if year_max is not None:
        query = query.filter(models.CarListing.year <= year_max)

    if price_min is not None:
        query = query.filter(models.CarListing.price >= price_min)

    if price_max is not None:
        query = query.filter(models.CarListing.price <= price_max)

    column = getattr(models.CarListing, sort_by.value)

    if order == schemas.Order.DESC:
        if sort_by == schemas.SortBy.BRAND:
            query = query.order_by(column.desc(), models.CarListing.model.desc())
        else:
            query = query.order_by(column.desc())
    else:
        if sort_by == schemas.SortBy.BRAND:
            query = query.order_by(column.asc(), models.CarListing.model.asc())
        else:
            query = query.order_by(column.asc())

    skip = (page - 1) * page_size
    total = query.count()

    response = {
        "items": query.offset(skip).limit(page_size).all(),
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
