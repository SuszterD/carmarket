import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { ListingService } from '../../../services/listing.service';
import { CarListing } from '../../../models/car-listing.model';

@Component({
  selector: 'app-listings-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listings-list.html',
  styleUrl: './listings-list.css',
})
export class ListingsList {
  listings$: Observable<CarListing[]>;

  constructor(private listingService: ListingService) {
    this.listings$ = this.listingService.getListings();
  }
}
