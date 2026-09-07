import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service';
import { environment } from '../../../environments/environment';
import { Property } from '../properties/models/property.model';
import { OpenHouse, OpenHouseTableRow } from './models/open-house.model';

@Injectable({
  providedIn: 'root',
})
export class OpenHousesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = this.authService.agentId;
  public tableData = signal<OpenHouse[]>([]);

  getOpenHouseData() {
    return this.http
      .get<OpenHouse[]>(`${this.baseUrl}/agents/${this.agentId()}/open-houses`)
      .subscribe((response) => {
        this.tableData.set(response);
      });
  }
}
