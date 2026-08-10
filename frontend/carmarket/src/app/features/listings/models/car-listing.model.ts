export const FUEL_TYPES = ['Benzin', 'Gázolaj', 'Hybrid'];

export interface SortPreset {
  value: string;
  label: string;
  sortBy: string;
  order: string;
}

export const SORT_PRESETS: SortPreset[] = [
  { value: 'price_asc', label: 'Ár növekvő', sortBy: 'price', order: 'asc' },
  { value: 'price_desc', label: 'Ár csökkenő', sortBy: 'price', order: 'desc' },
  { value: 'year_asc', label: 'Évjárat növekvő', sortBy: 'year', order: 'asc' },
  { value: 'year_desc', label: 'Évjárat csökkenő', sortBy: 'year', order: 'desc' },
  { value: 'mileage_asc', label: 'Km óra állás növekvő', sortBy: 'mileage', order: 'asc' },
  { value: 'mileage_desc', label: 'Km óra állás csökkenő', sortBy: 'mileage', order: 'desc' },
  { value: 'created_at_asc', label: 'Legrégebbi hirdetés', sortBy: 'created_at', order: 'asc' },
  { value: 'created_at_desc', label: 'Legújabb hirdetés', sortBy: 'created_at', order: 'desc' },
  { value: 'brand_asc', label: 'Márka A-Z', sortBy: 'brand', order: 'asc' },
  { value: 'brand_desc', label: 'Márka Z-A', sortBy: 'brand', order: 'desc' },
];

export const DEFAULT_SORT_PRESET = 'created_at_desc';

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
