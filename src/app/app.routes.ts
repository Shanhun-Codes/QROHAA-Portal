import { Routes } from '@angular/router';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';

export const routes: Routes = [
  {
    path: '',
    component: PageWrapperComponent,
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
    ],
  },
];
