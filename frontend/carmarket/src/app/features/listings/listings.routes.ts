import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth-guard';

export const ListingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/listings-page/listings-page').then((m) => m.ListingsPage),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/listing-create-page/listing-create-page').then((m) => m.ListingCreatePage),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/listing-edit-page/listing-edit-page').then((m) => m.ListingEditPage),
  },
];
