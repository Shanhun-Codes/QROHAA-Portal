import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AgentProfile, AgentResponse } from './auth.model';
import { SnackbarService } from '../shared/components/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly snackbarService = inject(SnackbarService);
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
}
