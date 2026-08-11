import { Component, signal } from '@angular/core';
import { ListingService } from '../../services/listings.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarListing } from '../../models/car-listing.model';
import { NotFound } from '../../../../shared/pages/not-found/not-found';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-listing-detail-page',
  standalone: true,
  imports: [NotFound, DecimalPipe, RouterLink],
  templateUrl: './listing-detail-page.html',
  styleUrl: './listing-detail-page.css',
})
export class ListingDetailPage {
  listing = signal<CarListing | undefined>(undefined);
  notFound = signal(false);
  loading = signal(true);

  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading.set(false);
      this.notFound.set(true);
      return;
    }

    this.listingService.getListing(id).subscribe({
      next: (listing) => {
        this.loading.set(false);
        this.listing.set(listing);
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
      },
    });
  }
}
