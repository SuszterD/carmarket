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
}

@Component({
  selector: 'app-listings-list',
  standalone: true,
  imports: [CommonModule, ListingCard],
  templateUrl: './listings-list.html',
  styleUrl: './listings-list.css',
})
export class ListingsList {
  private refresh$ = new Subject<void>();
  listingsState$: Observable<ListingsState>;

  constructor(private listingService: ListingService) {
    this.listingsState$ = this.refresh$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.listingService.getListings().pipe(
          map((listings) => ({
            listings,
            loading: false,
            error: false,
          })),

          startWith({
            listings: [],
            loading: true,
            error: false,
          }),

          catchError(() =>
            of({
              listings: [],
              loading: false,
              error: true,
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
}
