import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly agentId = signal('cmtp23wx10000jvv8l8fni38e');
}
