import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AgentProfile, AgentResponse } from './auth.model';
import { SnackbarService } from '../shared/components/snackbar/snackbar.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private readonly router = inject(Router);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly agentAppBaseUrl = environment.agentAppApiUrl;
  readonly agent = signal<AgentProfile | null>(null);
  private currentAgentRequest: Promise<void> | null = null;

  async updateCurrentAgent(agent: AgentProfile): Promise<boolean> {
    if (!agent) {
      this.snackbarService.error('An error occurred, please try again');
      return false;
    }

    const payload = agent;

    try {
      const response = await firstValueFrom(
        this.http.patch<AgentProfile>(
          `${this.agentAppBaseUrl}/agents`,
          payload,
        ),
      );

      this.snackbarService.success('Agent successfully updated');
      this.agent.set(response);

      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  getCurrentAgent(): Promise<void> {
    if (this.agent()) {
      return Promise.resolve();
    }

    if (this.currentAgentRequest) {
      return this.currentAgentRequest;
    }

    this.currentAgentRequest = this.loadCurrentAgent();

    return this.currentAgentRequest;
  }

  private async loadCurrentAgent(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<AgentResponse>(`${this.baseUrl}/onboarding/me`),
      );

      this.agent.set(response.agent);
    } catch {
      this.agent.set(null);
    } finally {
      this.currentAgentRequest = null;
    }
  }

  logout(): void {
    this.agent.set(null);

    this.oidcSecurityService.logoffLocal();

    const logoutUri = `${window.location.origin}/auth`;

    window.location.href =
      `https://auth.open-house.studio/logout` +
      `?client_id=27aqgqq5fiqak5bubmql7nifdu` +
      `&logout_uri=${encodeURIComponent(logoutUri)}`;
  }
}
