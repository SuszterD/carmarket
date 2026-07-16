import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'listings',
    pathMatch: 'full',
  },
  {
    path: 'listings',
    loadChildren: () => import('./features/listings/listings.routes').then((m) => m.ListingsRoutes),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login-page/login-page').then((m) => m.LoginPage),
  },
];
