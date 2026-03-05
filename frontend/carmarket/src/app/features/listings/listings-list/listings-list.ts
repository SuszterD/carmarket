import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, catchError, startWith, of, delay } from 'rxjs';

import { ListingService } from '../../../services/listing.service';
import { CarListing } from '../../../models/car-listing.model';
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
  listingsState$: Observable<ListingsState>;

  constructor(private listingService: ListingService) {
    this.listingsState$ = this.listingService.getListings().pipe(
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
    );
  }
}
