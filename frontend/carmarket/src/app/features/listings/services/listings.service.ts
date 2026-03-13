import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CarListing } from '../models/car-listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private apiUrl = '/api/listings';

  constructor(private http: HttpClient) {}

  getListings(): Observable<CarListing[]> {
    return this.http.get<CarListing[]>(this.apiUrl);
  }

  createListing(data: CarListing) {
    return this.http.post(this.apiUrl, data);
  }
}
