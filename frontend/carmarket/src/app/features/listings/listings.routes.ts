import { Routes } from '@angular/router';

export const ListingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/listings-page/listings-page').then((m) => m.ListingsPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/listing-create-page/listing-create-page').then((m) => m.ListingCreatePage),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/listing-edit-page/listing-edit-page').then((m) => m.ListingEditPage),
  },
];
