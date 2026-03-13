import { Component } from '@angular/core';
import { ListingsList } from '../../components/listings-list/listings-list';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [ListingsList],
  templateUrl: './listings-page.html',
  styleUrl: './listings-page.css',
})
export class ListingsPage {}
