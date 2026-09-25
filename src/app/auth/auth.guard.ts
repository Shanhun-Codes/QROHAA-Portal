import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(OidcSecurityService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    take(1),
    map(({ isAuthenticated }) =>
      isAuthenticated ? true : router.createUrlTree(['/auth']),
    ),
  );
};
