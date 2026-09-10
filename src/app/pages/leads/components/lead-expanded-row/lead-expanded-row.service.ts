import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadExpandedRowService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = environment.agentId;

  public leadDetails = signal<any>({});

  public getLead(leadId: string) {
    if (!this.agentId || !leadId) {
      return;
    }

    return this.http.get<any>(
      `${this.baseUrl}/agents/${this.agentId}/leads/${leadId}`,
    );
  }

  editLead(leadId: string, leadData: any) {}

  markLeadAsLost(leadId: string) {}
}
