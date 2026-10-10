import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, switchMap, take } from 'rxjs';

import { OnboardingService } from '../pages/setup-agent/setup-agent.service';

export const onboardingGuard: CanActivateFn = () => {
  const auth = inject(OidcSecurityService);
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1),
    switchMap(({ isAuthenticated }) => {
      if (!isAuthenticated) {
        return [router.createUrlTree(['/auth'])];
      }

      return onboardingService.getMe().pipe(
        map((response) => {
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
