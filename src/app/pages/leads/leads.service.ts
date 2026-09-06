import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth-service';
import { Lead } from './models/lead.model';
import { mapLeadStatusToPill } from './utils/lead-status.mapper';
import { formatPhoneNumber } from '../../shared/utils/format-phone-number';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = this.authService.agentId;

  public leads = signal<Lead[] | []>([]);

  public getLeads(): void {
    if (!this.agentId()) return;

    this.http
      .get<Lead[]>(`${this.baseUrl}/agent-app/agents/${this.agentId()}/leads`)
      .subscribe((response) => {
        this.leads.set(
          response.map((lead) => ({
            ...lead,
            name: `${lead.firstName} ${lead.lastName}`,
            phone: formatPhoneNumber(lead.phone),
          })),
        );
      });
  }
}
