import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth-service';
import { Lead } from './models/lead.model';
import { formatPhoneNumber } from '../../shared/utils/format-phone-number.util';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { AddLeadDialogComponent } from './dialogs/add-lead-dialog/add-lead-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);

  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = this.authService.agentId;

  public leads = signal<Lead[] | []>([]);

  public getLeads(): void {
    if (!this.agentId()) return;

    this.http
      .get<Lead[]>(`${this.baseUrl}/agents/${this.agentId()}/leads`)
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

  async openAddLeadDialog(): Promise<void> {
    const ref = this.dialogService.open<any>({
      title: 'Lead Details',
      contentComponent: AddLeadDialogComponent,
      data: {
        name: 'John Smith',
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
          value: 'cancel',
        },
        {
          label: 'Save',
          type: 'primary',
          submit: true,
        },
      ],
    });
    console.log('WAITING FOR DIALOG');

    const result = await ref.afterClosed();

    console.log('RESULT IN LEADS SERVICE:', result);
  }
}
