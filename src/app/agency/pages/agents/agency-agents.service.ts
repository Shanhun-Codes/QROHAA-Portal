import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AgencyOverview, InvitationResult } from './agency-agents.model';
@Injectable({ providedIn: 'root' })
export class AgencyAgentsService {
  private readonly http = inject(HttpClient);
  private url(agencyId: string) {
    return `${environment.apiBaseUrl}/agency-app/agencies/${agencyId}`;
  }
  getOverview(agencyId: string) {
    return this.http.get<AgencyOverview>(this.url(agencyId));
  }
  invite(agencyId: string, values: { email: string; role: string }) {
    return this.http.post<InvitationResult>(
      `${this.url(agencyId)}/invitations`,
      values,
    );
  }
  resend(agencyId: string, invitationId: string) {
    return this.http.post<InvitationResult>(
      `${this.url(agencyId)}/invitations/${invitationId}/resend`,
      {},
    );
  }
  revoke(agencyId: string, invitationId: string) {
    return this.http.patch(
      `${this.url(agencyId)}/invitations/${invitationId}/revoke`,
      {},
    );
  }
  updateStatus(
    agencyId: string,
    memberId: string,
    status: 'ACTIVE' | 'SUSPENDED',
  ) {
    return this.http.patch(`${this.url(agencyId)}/members/${memberId}/status`, {
      status,
    });
  }
}
