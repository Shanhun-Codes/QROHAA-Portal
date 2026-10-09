import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AgentProfile, AgentResponse } from '../../auth/auth.model';
import { AgentSetupRequest } from './setup-agent.model';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  constructor(private readonly http: HttpClient) {}

  getMe() {
    return this.http.get<AgentResponse>(
      `${environment.apiBaseUrl}/onboarding/me`,
    );
  }

  createAgent(body: AgentSetupRequest) {
    return this.http.post<AgentProfile>(
      `${environment.apiBaseUrl}/onboarding/agent`,
      body,
    );
  }
}
