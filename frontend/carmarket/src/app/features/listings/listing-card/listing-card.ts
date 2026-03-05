import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarListing } from '../../../models/car-listing.model';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCard {
  @Input() listing!: CarListing;
}
