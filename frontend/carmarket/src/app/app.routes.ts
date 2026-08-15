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
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register-page/register-page').then((m) => m.RegisterPage),
  },
  {
    path: '**',
    loadComponent: () => import('./shared/pages/not-found/not-found').then((m) => m.NotFound),
  },
];
