import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(OidcSecurityService);
  const router = inject(Router);
  const invitationToken = new URLSearchParams(route.fragment ?? '').get(
    'invite',
  );
  if (invitationToken) {
    sessionStorage.setItem('onboarding-invitation', invitationToken);
  }

  return auth.isAuthenticated$.pipe(
    take(1),
    map(({ isAuthenticated }) =>
      isAuthenticated ? true : router.createUrlTree(['/auth']),
    ),
  );
};
