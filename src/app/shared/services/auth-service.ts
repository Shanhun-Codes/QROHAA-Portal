import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly _agentId = environment.agentId;
  readonly agentId = signal(this._agentId);
}
