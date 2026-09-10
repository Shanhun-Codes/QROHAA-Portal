import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth-service';
import { Property } from './models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = this.authService.agentId;
  public tableData = signal<Property[]>([]);

  public getProperties() {
    if (!this.agentId()) {
      return;
    }
    return this.http.get<any>(
      `${this.baseUrl}/agents/${this.agentId()}/properties`,
    );
  }
}
