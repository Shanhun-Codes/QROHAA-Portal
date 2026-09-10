import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth-service';
import { AddLeadFormValue, Lead, LeadStatusType } from './models/lead.model';
import { formatPhoneNumber } from '../../shared/utils/format-phone-number.util';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { LeadDialogComponent } from './components/dialogs/lead-dialog/lead-dialog.component';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { firstValueFrom } from 'rxjs';
import { DialogType } from './models/note.model';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);

  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = this.authService.agentId;

  public leads = signal<Lead[] | []>([]);

  public getLeads() {
    if (!this.agentId()) {
      return;
    }

    return this.http.get<Lead[]>(
      `${this.baseUrl}/agents/${this.agentId()}/leads`,
    );
  }

  async createLead(data: AddLeadFormValue): Promise<boolean> {
    const payload = {
      ...data,
      phone: data.phone.trim() || null,
      email: data.email.trim() || null,
      agentId: this.agentId(),
    };

    try {
      await firstValueFrom(
        this.http.post<Lead>(`${this.baseUrl}/leads`, payload),
      );

      this.snackbarService.success('Lead successfully created');

      this.getLeads()?.subscribe((response) => {
        this.leads.set(
          response.map((lead) => ({
            ...lead,
            name: `${lead.firstName} ${lead.lastName}`,
            phone: formatPhoneNumber(lead.phone),
          })),
        );
      });

      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async openLeadDialog(mode: DialogType, leadId?: string): Promise<void> {
    this.dialogService.open({
      title: 'Lead Details',
      contentComponent: LeadDialogComponent,
      data: {
        onSubmit: (values: AddLeadFormValue) => this.createLead(values),
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: mode === 'CREATE' ? 'Create Lead' : 'Update Lead',
          type: 'primary',
          submit: true,
        },
      ],
    });
  }

  async updateMultipleLeadsStatus(leadIds: string[], status: LeadStatusType) {
    try {
      const response = await firstValueFrom(
        this.http.patch<Lead[]>(
          `${this.baseUrl}/agents/${this.agentId()}/leads/status`,
          {
            leadIds,
            status,
          },
        ),
      );

      this.leads.set(
        response.map((lead) => ({
          ...lead,
          name: `${lead.firstName} ${lead.lastName}`,
          phone: formatPhoneNumber(lead.phone),
        })),
      );

      this.snackbarService.success(
        `${leadIds.length} ${leadIds.length > 1 ? 'leads' : 'lead'} successfully updated`,
      );

      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }
}
