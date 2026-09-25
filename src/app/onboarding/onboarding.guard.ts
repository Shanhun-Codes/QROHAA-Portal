import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { switchMap, map, take } from 'rxjs';

import { OidcSecurityService } from 'angular-auth-oidc-client';
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

      return onboardingService
        .getMe()
        .pipe(
          map((response: any) =>
            response.hasAgent ? true : router.createUrlTree(['/setup-agent']),
          ),
        );
    }),
  );
};
