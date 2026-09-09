import { Component, computed, inject, OnInit } from '@angular/core';

import { TableComponent } from '../../shared/components/table/table.component';
import { LEADS_TABLE_HEADER_CONFIG } from './config/leads-table-header-config';
import { LeadStatusType } from './models/lead.model';
import { mapLeadStatusToPill } from './utils/lead-status.mapper';
import { LeadsService } from './leads.service';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import {
  ACTION_BUTTON_CONFIG,
  LEADS_BUTTON_CONFIG,
  NOTE_BUTTON_CONFIG,
} from './config/button.config';
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { AppLoadingService } from '../../shared/services/app-loading.service';
import { formatPhoneNumber } from '../../shared/utils/format-phone-number.util';
import { LeadExpandedRowComponent } from './components/lead-expanded-row/lead-expanded-row.component';

@Component({
  selector: 'aa-leads',
  standalone: true,
  imports: [TableComponent, PageTemplateComponent, LeadExpandedRowComponent],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  private readonly leadsService = inject(LeadsService);
  private readonly appLoaderService = inject(AppLoadingService);
  readonly isLoading = this.appLoaderService.isAppLoading;

  readonly title = 'Leads';
  readonly subtitle = 'Manage and follow up with your open house leads here';

  readonly addLeadButtonConfig = {
    ...LEADS_BUTTON_CONFIG,
    click: () => this.onAddLeadClick(),
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

  onAddLeadClick() {
    this.leadsService.openLeadDialog('ADD');
  }

  onLeadExpanded(e: string) {}
}
