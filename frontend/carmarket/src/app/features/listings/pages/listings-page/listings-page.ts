import { Component } from '@angular/core';
import { ListingsList } from '../../components/listings-list/listings-list';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [ListingsList, RouterLink],
  templateUrl: './listings-page.html',
  styleUrl: './listings-page.css',
})
export class ListingsPage {}
