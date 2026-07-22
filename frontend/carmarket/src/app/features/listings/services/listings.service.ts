import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CarListing, ListingsQueryOptions, PaginatedListings } from '../models/car-listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  private apiUrl = '/api/listings';

  constructor(private http: HttpClient) {}

  getListings(options: ListingsQueryOptions): Observable<PaginatedListings> {
    const params: Record<string, string | number> = {
      page: options.page,
      page_size: options.pageSize,
    };

    if (options.brand !== undefined) {
      params['brand'] = options.brand;
    }
    if (options.fuelType !== undefined) {
      params['fuel_type'] = options.fuelType;
    }
    if (options.yearMin !== undefined) {
      params['year_min'] = options.yearMin;
    }
    if (options.yearMax !== undefined) {
      params['year_max'] = options.yearMax;
    }
    if (options.priceMin !== undefined) {
      params['price_min'] = options.priceMin;
    }
    if (options.priceMax !== undefined) {
      params['price_max'] = options.priceMax;
    }
    return this.http.get<PaginatedListings>(this.apiUrl, { params });
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
