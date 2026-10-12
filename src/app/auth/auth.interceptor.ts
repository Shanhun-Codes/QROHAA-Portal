import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, switchMap, take, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

// Invitation identity errors must remain visible without discarding the join flow.
export const HANDLE_AUTH_ERROR_LOCALLY = new HttpContextToken(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(OidcSecurityService);
  const router = inject(Router);

  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  return auth.getAccessToken().pipe(
    take(1),
    switchMap((accessToken) => {
      const authenticatedRequest = accessToken
        ? req.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        : req;

      return next(authenticatedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && !req.context.get(HANDLE_AUTH_ERROR_LOCALLY)) {
            auth.logoffLocal();

            void router.navigate(['/auth']);
          }

          return throwError(() => error);
        }),
      );
    }),
  );
};
