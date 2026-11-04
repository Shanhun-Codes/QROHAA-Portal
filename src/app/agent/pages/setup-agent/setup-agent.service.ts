import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { switchMap, take } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AgentProfile, AgentResponse } from '../../../auth/auth.model';
import { AgentSetupRequest } from './setup-agent.model';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  constructor(
    private readonly http: HttpClient,
    private readonly oidcSecurityService: OidcSecurityService,
  ) {}

  getMe() {
    return this.http.get<AgentResponse>(
      `${environment.apiBaseUrl}/onboarding/me`,
    );
  }

  inspectInvitation(invitationToken: string) {
    return this.oidcSecurityService.getIdToken().pipe(
      take(1),
      switchMap((idToken) =>
        this.http.post<{ accountType: 'AGENT' | 'AGENCY' }>(
          `${environment.apiBaseUrl}/onboarding/invitation`,
          { invitationToken },
          { headers: { 'X-Cognito-Id-Token': idToken } },
        ),
      ),
    );
  }

  createAgency(
    invitationToken: string,
    agency: { name: string; headline?: string },
  ) {
    return this.oidcSecurityService.getIdToken().pipe(
      take(1),
      switchMap((idToken) =>
        this.http.post(
          `${environment.apiBaseUrl}/onboarding/agent`,
          { invitationToken, agency },
          { headers: { 'X-Cognito-Id-Token': idToken } },
        ),
      ),
    );
  }

  createAgent(body: AgentSetupRequest) {
    return this.oidcSecurityService.getIdToken().pipe(
      take(1),
      switchMap((idToken) =>
        this.http.post<AgentProfile>(
          `${environment.apiBaseUrl}/onboarding/agent`,
          body,
          { headers: { 'X-Cognito-Id-Token': idToken } },
        ),
      ),
    );
  }
}
