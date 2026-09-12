import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap, take } from 'rxjs';

import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(OidcSecurityService);

  console.log('INTERCEPTOR URL:', req.url);
  console.log(
    'STARTS WITH API BASE:',
    req.url.startsWith(environment.apiBaseUrl),
  );

  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  return auth.getAccessToken().pipe(
    take(1),
    switchMap((accessToken) => {
      console.log('HAS ACCESS TOKEN:', !!accessToken);

      if (!accessToken) {
        return next(req);
      }

      const authenticatedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return next(authenticatedRequest);
    }),
  );
};
