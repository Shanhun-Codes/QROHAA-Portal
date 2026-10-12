import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, switchMap, take } from 'rxjs';

import { OnboardingService } from '../agent/pages/setup-agent/setup-agent.service';

export const onboardingGuard: CanActivateFn = (_route, state) => {
  const auth = inject(OidcSecurityService);
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1),
    switchMap(({ isAuthenticated }) => {
      if (!isAuthenticated) {
        return [router.createUrlTree(['/auth'])];
      }

      if (sessionStorage.getItem('agency-invitation'))
        return [router.createUrlTree(['/join-agency'])];
      return onboardingService.getMe().pipe(
        map((response) => {
          if (
            response.role === 'AGENCY_ADMIN' &&
            response.accessGranted &&
            response.agencyId
          ) {
            return response.hasAgent ||
              state.url === '/agency' ||
              state.url.startsWith('/agency/')
              ? true
              : router.createUrlTree(['/agency']);
          }
          const isActivePlatformAdmin =
            response.role === 'PLATFORM_ADMIN' &&
            response.status === 'ACTIVE' &&
            response.accessGranted === true;

          const isAuthorizedAgent =
            response.hasAgent && response.accessGranted === true;

          if (isActivePlatformAdmin || isAuthorizedAgent) {
            return true;
          }

          return router.createUrlTree([
            response.accessStatus || !response.invitationRequired
              ? '/access-pending'
              : '/setup-agent',
          ]);
        }),
      );
    }),
  );
};
