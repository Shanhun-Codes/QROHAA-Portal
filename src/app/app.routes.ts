import { Routes } from '@angular/router';

import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: '',
    component: PageWrapperComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/leads/leads.component').then((m) => m.LeadsComponent),
      },
      {
        path: 'properties',
        loadComponent: () =>
          import('./pages/properties/properties.component').then(
            (m) => m.PropertiesComponent,
          ),
      },
      {
        path: 'open-houses',
        loadComponent: () =>
          import('./pages/open-houses/open-houses.component').then(
            (m) => m.OpenHousesComponent,
          ),
      },
    ],
  },
];
