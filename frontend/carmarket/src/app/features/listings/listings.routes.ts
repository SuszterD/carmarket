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
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/listing-detail-page/listing-detail-page').then((m) => m.ListingDetailPage),
  },
];
