import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarListing } from '../../models/car-listing.model';
import { RouterLink } from '@angular/router';

import { ListingService } from '../../services/listings.service';
import { Auth, User } from '../../../../core/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCard {
  @Input() listing!: CarListing;
  @Output() onDelete: EventEmitter<void> = new EventEmitter<void>();

  currentUser$: Observable<User | null>;

  constructor(
    private listingService: ListingService,
    private authService: Auth,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  deleteListing() {
    const confirmed = window.confirm('Biztosan törölni szeretnéd ezt a hirdetést?');

    if (!confirmed) {
      return;
    }

    this.listingService.deleteListing(this.listing.id).subscribe(() => {
      this.onDelete.emit();
    });
  }
}
