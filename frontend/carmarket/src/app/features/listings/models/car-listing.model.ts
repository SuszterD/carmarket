export interface CarListing {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  description: string;
  created_at: string;
}

interface ListingsState {
  listings: CarListing[];
  loading: boolean;
  error: boolean;
}
