export const FUEL_TYPES = ['Benzin', 'Gázolaj', 'Hybrid'];

export const SORT_BY: Record<string, string> = {
  brand: 'Márka',
  year: 'Évjárat',
  price: 'Ár',
  mileage: 'Km óra állása',
  created_at: 'Létrehozás dátuma',
};

export const ORDER: Record<string, string> = { asc: 'Növekvő', desc: 'Csökkenő' };

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

export interface ListingsQueryOptions {
  page: number;
  pageSize: number;
  brand?: string;
  fuelType?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  order?: string;
}
