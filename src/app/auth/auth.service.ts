import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { AgentProfile, AgentResponse } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  readonly agent = signal<AgentProfile | null>(null);

  private currentAgentRequest: Promise<void> | null = null;

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
