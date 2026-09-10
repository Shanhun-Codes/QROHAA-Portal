import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';

import { TableComponent } from '../../shared/components/table/table.component';
import { LEADS_TABLE_HEADER_CONFIG } from './config/leads-table-header-config';
import { LeadStatusType } from './models/lead.model';
import { mapLeadStatusToPill } from './utils/lead-status.mapper';
import { LeadsService } from './leads.service';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import {
  LEADS_BUTTON_CONFIG,
  UPDATE_STATUS_BUTTON_CONFIG,
} from './config/button.config';

import { AppLoadingService } from '../../shared/services/app-loading.service';
import { formatPhoneNumber } from '../../shared/utils/format-phone-number.util';
import { LeadExpandedRowComponent } from './components/lead-expanded-row/lead-expanded-row.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  SelectComponent,
  SelectOption,
} from '../../shared/components/inputs/select/select.component';

@Component({
  selector: 'aa-leads',
  standalone: true,
  imports: [
    TableComponent,
    PageTemplateComponent,
    LeadExpandedRowComponent,
    ButtonComponent,
    SelectComponent,
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  private readonly leadsService = inject(LeadsService);
  private readonly appLoaderService = inject(AppLoadingService);
  readonly leadView = signal<'ACTIVE' | 'CLOSED'>('ACTIVE');

  readonly table = viewChild(TableComponent);

  readonly isLoading = this.appLoaderService.isAppLoading;

  readonly title = 'Leads';
  readonly subtitle = 'Manage and follow up with your open house leads here';

  readonly selectedLeadIds = signal<string[]>([]);
  readonly selectedStatus = signal<LeadStatusType | null>(null);

  readonly statusOptions: SelectOption<LeadStatusType>[] = [
    {
      label: 'New',
      value: LeadStatusType.NEW,
    },
    {
      label: 'Contacted',
      value: LeadStatusType.CONTACTED,
    },
    {
      label: 'Follow Up',
      value: LeadStatusType.FOLLOW_UP,
    },
    {
      label: 'Qualified',
      value: LeadStatusType.QUALIFIED,
    },
    {
      label: 'Closed',
      value: LeadStatusType.CLOSED,
    },
  ];

  readonly addLeadButtonConfig = {
    ...LEADS_BUTTON_CONFIG,
    click: () => this.onAddLeadClick(),
  };

  readonly updateStatusButtonConfig = {
    ...UPDATE_STATUS_BUTTON_CONFIG,
    click: () => this.onUpdateStatusClick(),
  };

  readonly tableHeaderConfig = LEADS_TABLE_HEADER_CONFIG;

  readonly tableData = computed(() =>
    this.leadsService.leads().map((lead) => ({
      ...lead,
      status: mapLeadStatusToPill(lead.status as LeadStatusType),
    })),
  );

  ngOnInit(): void {
    const minimumDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, 1500),
    );

    const fontsReady = document.fonts.ready;

    const leadsRequest = new Promise<void>((resolve, reject) => {
      const request = this.leadsService.getLeads();

      if (!request) {
        resolve();
        return;
      }

      request.subscribe({
        next: (response) => {
          this.leadsService.leads.set(
            response.map((lead) => ({
              ...lead,
              name: `${lead.firstName} ${lead.lastName}`,
              phone: formatPhoneNumber(lead.phone),
            })),
          );

          resolve();
        },
        error: reject,
      });
    });

    Promise.all([leadsRequest, minimumDelay, fontsReady]).finally(() => {
      this.appLoaderService.stopLoading();
    });
  }

  onAddLeadClick(): void {
    this.leadsService.openLeadDialog('CREATE');
  }

  onLeadExpanded(e: string): void {}

  onSelectionChange(ids: string[]): void {
    this.selectedLeadIds.set(ids);

    console.log('SELECTED LEAD IDS:', ids);
  }

  onStatusChange(status: LeadStatusType): void {
    this.selectedStatus.set(status);
  }

  async onUpdateStatusClick(): Promise<void> {
    const leadIds = this.selectedLeadIds();
    const status = this.selectedStatus();

    if (!leadIds.length || !status) {
      return;
    }

    const success = await this.leadsService.updateMultipleLeadsStatus(
      leadIds,
      status,
    );

    if (!success) return;

    this.table()?.clearSelection();
    this.selectedStatus.set(null);
  }

  onClearSelectionClick(): void {
    this.table()?.clearSelection();
    this.selectedStatus.set(null);
  }
}
