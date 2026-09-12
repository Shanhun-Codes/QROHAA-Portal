import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(OidcSecurityService);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map((result) => {
      if (result.isAuthenticated) {
        return true;
      }

      return router.createUrlTree(['/auth']);
    }),
  );
};
