import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarListing } from '../../models/car-listing.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCard {
  @Input() listing!: CarListing;
}
