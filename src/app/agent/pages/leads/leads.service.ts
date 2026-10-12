import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AddLeadFormValue, Lead, LeadStatusType } from './models/lead.model';
import { formatPhoneNumber } from '../../../shared/utils/format-phone-number.util';
import { DialogService } from '../../../shared/components/dialog/dialog.service';
import { LeadDialogComponent } from './components/dialogs/lead-dialog/lead-dialog.component';
import { SnackbarService } from '../../../shared/components/snackbar/snackbar.service';
import { firstValueFrom } from 'rxjs';
import { DialogType } from './models/note.model';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  private readonly http = inject(HttpClient);
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  public leads = signal<Lead[] | []>([]);

  public getLeads() {
    return this.http.get<Lead[]>(`${this.agentAppBaseUrl}/leads`);
  }

  async createLead(data: AddLeadFormValue): Promise<boolean> {
    const payload = {
      ...data,
      phone: data.phone.trim() || null,
      email: data.email.trim() || null,
    };

    try {
      await firstValueFrom(
        this.http.post<Lead>(`${this.agentAppBaseUrl}/leads`, payload),
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
    const lead =
      mode === 'EDIT' && leadId
        ? await firstValueFrom(
            this.http.get<Lead>(`${this.agentAppBaseUrl}/leads/${leadId}`),
          )
        : undefined;
    const ref = this.dialogService.open({
      title: 'Lead Details',
      contentComponent: LeadDialogComponent,
      data: {
        lead,
        onSubmit: (values: AddLeadFormValue) =>
          mode === 'EDIT' && leadId
            ? this.updateLead(leadId, values)
            : this.createLead(values),
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
    await ref.afterClosed();
  }

  async updateLead(id: string, values: AddLeadFormValue): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.patch(`${this.agentAppBaseUrl}/leads/${id}`, {
          ...values,
          email: values.email?.trim() || null,
          phone: values.phone?.trim() || null,
        }),
      );
      const leads = await firstValueFrom(this.getLeads());
      this.leads.set(
        leads.map((lead) => ({
          ...lead,
          name: `${lead.firstName ?? ''} ${lead.lastName ?? ''}`.trim(),
          phone: formatPhoneNumber(lead.phone),
        })),
      );
      this.snackbarService.success('Lead successfully updated');
      return true;
    } catch {
      this.snackbarService.error('Unable to update lead. Please try again.');
      return false;
    }
  }

  async updateMultipleLeadsStatus(leadIds: string[], status: LeadStatusType) {
    try {
      const response = await firstValueFrom(
        this.http.patch<Lead[]>(`${this.agentAppBaseUrl}/leads/status`, {
          leadIds,
          status,
        }),
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
