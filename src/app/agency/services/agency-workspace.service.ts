import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AgencyOption } from '../models/agency.model';
@Injectable({ providedIn: 'root' })
export class AgencyWorkspaceService {
  private readonly http = inject(HttpClient);
  readonly selectedAgency = signal('');
  getAgencies() {
    return this.http.get<AgencyOption[]>(
      `${environment.apiBaseUrl}/agency-app/agencies`,
    );
  }
}
