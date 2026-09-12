import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  constructor(private readonly http: HttpClient) {}

  getMe() {
    return this.http.get(`${environment.apiBaseUrl}/onboarding/me`);
  }

  createAgent(body: unknown) {
    return this.http.post(`${environment.apiBaseUrl}/onboarding/agent`, body);
  }
}
