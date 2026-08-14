import { Component, signal } from '@angular/core';
import { ListingService } from '../../services/listings.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarListing } from '../../models/car-listing.model';
import { NotFound } from '../../../../shared/pages/not-found/not-found';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Auth, User } from '../../../../core/auth.service';

@Component({
  selector: 'app-listing-detail-page',
  standalone: true,
  imports: [NotFound, CommonModule, RouterLink],
  templateUrl: './listing-detail-page.html',
  styleUrl: './listing-detail-page.css',
})
export class ListingDetailPage {
  listing = signal<CarListing | undefined>(undefined);
  notFound = signal(false);
  loading = signal(true);

  currentUser$: Observable<User | null>;

  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    private authService: Auth,
    private router: Router,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

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

  deleteListing() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    const confirmed = window.confirm('Biztosan törölni szeretnéd ezt a hirdetést?');

    if (!confirmed) {
      return;
    }

    this.listingService.deleteListing(id).subscribe(() => {
      this.router.navigate(['/listings']);
    });
  }
}
