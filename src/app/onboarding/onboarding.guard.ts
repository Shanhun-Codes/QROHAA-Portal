import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap, map } from 'rxjs';
import { OnboardingService } from '../pages/setup-agent/setup-agent.service';

export const onboardingGuard: CanActivateFn = () => {
  const auth = inject(OidcSecurityService);
  const onboardingService = inject(OnboardingService);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    switchMap((authResult) => {
      if (!authResult.isAuthenticated) {
        return [router.createUrlTree(['/auth'])];
      }

      return onboardingService.getMe().pipe(
        map((response: any) => {
          if (response.hasAgent) {
            return true;
          }

          return router.createUrlTree(['/setup-agent']);
        }),
      );
    }),
  );
};
