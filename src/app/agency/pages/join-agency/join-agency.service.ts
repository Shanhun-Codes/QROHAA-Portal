import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { HANDLE_AUTH_ERROR_LOCALLY } from '../../../auth/auth.interceptor';
import { InvitationPreview } from './join-agency.model';
@Injectable({ providedIn: 'root' })
export class JoinAgencyService {
  private readonly http = inject(HttpClient);
  inspect(invitationToken: string, idToken: string) {
    return this.http.post<InvitationPreview>(
      `${environment.apiBaseUrl}/onboarding/agency-invitation`,
      { invitationToken },
      { headers: { 'X-Cognito-Id-Token': idToken },
        context: new HttpContext().set(HANDLE_AUTH_ERROR_LOCALLY, true) },
    );
  }
  accept(invitationToken: string, idToken: string, values: object) {
    return this.http.post(
      `${environment.apiBaseUrl}/onboarding/agent`,
      { ...values, invitationToken },
      { headers: { 'X-Cognito-Id-Token': idToken },
        context: new HttpContext().set(HANDLE_AUTH_ERROR_LOCALLY, true) },
    );
  }
}
