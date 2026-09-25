import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import {
  provideAuth,
  withAppInitializerAuthCheck,
} from 'angular-auth-oidc-client';

import { routes } from './app.routes';
import { authConfig } from './auth/auth.config';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),

    provideAuth(authConfig, withAppInitializerAuthCheck()),
  ],
};
