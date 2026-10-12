import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, Routes } from '@angular/router';

import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';
import { authGuard } from './auth/auth.guard';
import { onboardingGuard } from './onboarding/onboarding.guard';

export const routes: Routes = [
  {
    path: 'join-agency',
    loadComponent: () =>
      import('./agency/pages/join-agency/join-agency.component').then(
        (m) => m.JoinAgencyComponent,
      ),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'setup-agent',
    canActivate: [authGuard, () => {
      const router = inject(Router);
      return !sessionStorage.getItem('agency-invitation') || router.createUrlTree(['/join-agency']);
    }],
    loadComponent: () =>
      import('./agent/pages/setup-agent/setup-agent.component').then(
        (m) => m.SetupAgentComponent,
      ),
  },
  {
    path: 'access-pending',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/access-pending/access-pending.component').then(
        (m) => m.AccessPendingComponent,
      ),
  },
  {
    path: '',
    component: PageWrapperComponent,
    canActivate: [authGuard, onboardingGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./agent/pages/leads/leads.component').then((m) => m.LeadsComponent),
      },
      {
        path: 'properties',
        loadComponent: () =>
          import('./agent/pages/properties/properties.component').then(
            (m) => m.PropertiesComponent,
          ),
      },
      {
        path: 'open-houses',
        loadComponent: () =>
          import('./agent/pages/open-houses/open-houses.component').then(
            (m) => m.OpenHousesComponent,
          ),
      },
      {
        path: 'agency',
        canActivate: [
          async () => {
            const auth = inject(AuthService);
            const router = inject(Router);
            await auth.getCurrentAgent();
            return auth.canAccessAgency() || router.createUrlTree(['/home']);
          },
        ],
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./agency/pages/agents/agency-agents.component').then(
                (m) => m.AgencyAgentsComponent,
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./agency/pages/settings/agency-settings.component').then(
                (m) => m.AgencySettingsComponent,
              ),
          },
          {
            path: 'help',
            loadComponent: () =>
              import('./pages/help/help.component').then(
                (m) => m.HelpComponent,
              ),
          },
        ],
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./pages/help/help.component').then((m) => m.HelpComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./agent/pages/profile/profile.component').then(
            (m) => m.ProfileComponent,
          ),
      },
    ],
  },
];
