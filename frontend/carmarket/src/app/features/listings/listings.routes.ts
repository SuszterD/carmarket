import { Routes } from '@angular/router';

export const ListingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/listings-page/listings-page').then((m) => m.ListingsPage),
  },
];
