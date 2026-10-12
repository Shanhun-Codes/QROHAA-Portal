import { TestBed } from '@angular/core/testing';
import { HttpContext, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom, of, throwError } from 'rxjs';
import { authInterceptor, HANDLE_AUTH_ERROR_LOCALLY } from './auth.interceptor';
import { environment } from '../../environments/environment';

describe('Invitation authentication recovery', () => {
  it('keeps invitation identity failures on the join page', async () => {
    const auth = { getAccessToken: () => of('test-token'), logoffLocal: jasmine.createSpy() };
    const router = { navigate: jasmine.createSpy() };
    TestBed.configureTestingModule({ providers: [
      { provide: OidcSecurityService, useValue: auth }, { provide: Router, useValue: router },
    ] });
    const error = new HttpErrorResponse({ status: 401 });
    const request = new HttpRequest('POST', `${environment.apiBaseUrl}/onboarding/agency-invitation`, {}, {
      context: new HttpContext().set(HANDLE_AUTH_ERROR_LOCALLY, true),
    });
    const result = TestBed.runInInjectionContext(() => authInterceptor(request, () => throwError(() => error)));
    await expectAsync(firstValueFrom(result)).toBeRejectedWith(error);
    expect(auth.logoffLocal).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
  it('still sends normal expired sessions to sign in', async () => {
    const auth = { getAccessToken: () => of('test-token'), logoffLocal: jasmine.createSpy() };
    const router = { navigate: jasmine.createSpy() };
    TestBed.configureTestingModule({ providers: [
      { provide: OidcSecurityService, useValue: auth }, { provide: Router, useValue: router },
    ] });
    const request = new HttpRequest('GET', `${environment.apiBaseUrl}/agent-app/leads`);
    const result = TestBed.runInInjectionContext(() => authInterceptor(request, () => throwError(() => new HttpErrorResponse({ status: 401 }))));
    await expectAsync(firstValueFrom(result)).toBeRejected();
    expect(auth.logoffLocal).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });
});
