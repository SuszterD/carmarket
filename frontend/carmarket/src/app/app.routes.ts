import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'listings',
    pathMatch: 'full',
  },
  {
    path: 'listings',
    loadComponent: () =>
      import('./features/listings/pages/listings-page/listings-page').then((m) => m.ListingsPage),
  },
];
