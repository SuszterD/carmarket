import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, catchError, startWith, of, Subject, switchMap } from 'rxjs';

import { ListingService } from '../../services/listings.service';
import { CarListing, ListingsQueryOptions } from '../../models/car-listing.model';
import { ListingCard } from '../listing-card/listing-card';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FUEL_TYPES } from '../../models/car-listing.model';

interface ListingsState {
  listings: CarListing[];
  loading: boolean;
  error: boolean;
  total: number;
  page: number;
  pageSize: number;
}

function stringOrUndefined(value: string): string | undefined {
  return value !== '' ? value : undefined;
}

function numberOrUndefined(value: string): number | undefined {
  return value !== '' ? Number(value) : undefined;
}

@Component({
  selector: 'app-listings-list',
  standalone: true,
  imports: [CommonModule, ListingCard, ReactiveFormsModule],
  templateUrl: './listings-list.html',
  styleUrl: './listings-list.css',
})
export class ListingsList {
  protected readonly Math = Math;
  private refresh$ = new Subject<void>();

  listingsState$: Observable<ListingsState>;
  filterForm: FormGroup;
  page = 1;
  pageSize = 25;
  fuelTypes = FUEL_TYPES;

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService,
  ) {
    this.filterForm = this.fb.group({
      brand: [''],
      fuel_type: [''],
      year_min: [''],
      year_max: [''],
      price_min: [''],
      price_max: [''],
    });
    this.listingsState$ = this.refresh$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.listingService.getListings(this.buildOptions()).pipe(
          map((response) => ({
            listings: response.items,
            loading: false,
            error: false,
            total: response.total,
            page: response.page,
            pageSize: response.page_size,
          })),

          startWith({
            listings: [],
            loading: true,
            error: false,
            total: 0,
            page: this.page,
            pageSize: this.pageSize,
          }),

          catchError(() =>
            of({
              listings: [],
              loading: false,
              error: true,
              total: 0,
              page: this.page,
              pageSize: this.pageSize,
            }),
          ),
        ),
      ),
    );
  }

  onListingDelete() {
    window.alert('A hirdetés törölve.');
    this.refresh$.next();
  }

  nextPage() {
    this.page++;
    this.refresh$.next();
  }

  prevPage() {
    this.page--;
    this.refresh$.next();
  }

  private buildOptions(): ListingsQueryOptions {
    const values = this.filterForm.value;
    const options: ListingsQueryOptions = {
      page: this.page,
      pageSize: this.pageSize,
    };
    options.brand = stringOrUndefined(values.brand);
    options.fuelType = stringOrUndefined(values.fuel_type);
    options.yearMin = numberOrUndefined(values.year_min);
    options.yearMax = numberOrUndefined(values.year_max);
    options.priceMin = numberOrUndefined(values.price_min);
    options.priceMax = numberOrUndefined(values.price_max);

    return options;
  }

  applyFilters() {
    this.page = 1;
    this.refresh$.next();
  }

  resetFilters() {
    this.filterForm.reset({
      brand: '',
      fuel_type: '',
      year_min: '',
      year_max: '',
      price_min: '',
      price_max: '',
    });
    this.applyFilters();
  }
}
