import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LeadsService } from '../../leads.service';
import { LeadStatusType } from '../../models/lead.model';
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

  private readonly leads = inject(LeadsService);
  editLead(leadId: string) {
    return this.leads.openLeadDialog('EDIT', leadId);
  }

  markLeadAsLost(leadId: string) {
    return this.leads.updateMultipleLeadsStatus([leadId], LeadStatusType.LOST);
  }
}
