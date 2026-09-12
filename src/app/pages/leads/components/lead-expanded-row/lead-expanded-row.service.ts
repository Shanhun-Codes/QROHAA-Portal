import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeadExpandedRowService {
  private readonly http = inject(HttpClient);
  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  public leadDetails = signal<any>({});

  public getLead(leadId: string) {
    if (!leadId) {
      return;
    }

    return this.http.get<any>(`${this.agentAppBaseUrl}/leads/${leadId}`);
  }

  editLead(leadId: string, leadData: any) {}

  markLeadAsLost(leadId: string) {}
}
