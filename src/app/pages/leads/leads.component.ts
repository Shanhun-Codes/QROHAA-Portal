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

import { formatPhoneNumber } from '../../shared/utils/format-phone-number.util';
import { LeadExpandedRowComponent } from './components/lead-expanded-row/lead-expanded-row.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  SelectComponent,
  SelectOption,
} from '../../shared/components/inputs/select/select.component';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';

@Component({
  selector: 'aa-leads',
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
  private readonly appLoaderService = inject(AppLoaderService);
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
    this.appLoaderService.runInitialLoad(
      () =>
        new Promise<void>((resolve) => {
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
            error: () => {
              resolve();
            },
          });
        }),
    );
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
