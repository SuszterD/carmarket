import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, catchError, startWith, of, Subject, switchMap } from 'rxjs';

import { ListingService } from '../../services/listings.service';
import { CarListing } from '../../models/car-listing.model';
import { ListingCard } from '../listing-card/listing-card';

interface ListingsState {
  listings: CarListing[];
  loading: boolean;
  error: boolean;
  total: number;
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-listings-list',
  standalone: true,
  imports: [CommonModule, ListingCard],
  templateUrl: './listings-list.html',
  styleUrl: './listings-list.css',
})
export class ListingsList {
  protected readonly Math = Math;
  private refresh$ = new Subject<void>();

  listingsState$: Observable<ListingsState>;
  page = 1;
  pageSize = 25;

  constructor(private listingService: ListingService) {
    this.listingsState$ = this.refresh$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.listingService.getListings(this.page, this.pageSize).pipe(
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
}
