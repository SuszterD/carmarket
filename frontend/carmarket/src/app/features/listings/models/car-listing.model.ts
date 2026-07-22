export interface CarListing {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  description: string;
  created_at: string;
}

export interface PaginatedListings {
  items: CarListing[];
  total: number;
  page: number;
  page_size: number;
}

export const FUEL_TYPES = ['Benzin', 'Gázolaj', 'Hybrid'];

export interface ListingsQueryOptions {
  page: number;
  pageSize: number;
  brand?: string;
  fuelType?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
}
