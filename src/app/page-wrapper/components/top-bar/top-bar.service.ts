import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TopBarService {
  private readonly authService = inject(AuthService);

  public title = 'Open House Studio';
  public activePortal = 'Agent App';
  public agent = this.authService.agent;

  getAgent() {
    return this.authService.getCurrentAgent();
  }
}
