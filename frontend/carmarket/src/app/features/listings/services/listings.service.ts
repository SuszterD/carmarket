import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CarListing } from '../models/car-listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private apiUrl = 'http://localhost:8000/listings';

  constructor(private http: HttpClient) {}

  getListings(): Observable<CarListing[]> {
    return this.http.get<CarListing[]>(this.apiUrl);
  }

  getListing(id: string): Observable<CarListing> {
    return this.http.get<CarListing>(`${this.apiUrl}/${id}`);
  }

  createListing(data: CarListing) {
    return this.http.post(this.apiUrl, data);
  }

  updateListing(id: string, data: CarListing) {
    return this.http.put<CarListing>(`${this.apiUrl}/${id}`, data);
  }

  deleteListing(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
