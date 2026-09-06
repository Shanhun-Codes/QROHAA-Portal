import { Component, computed, inject, OnInit } from '@angular/core';

import { TableComponent } from '../../shared/components/table/table.component';
import { LEADS_TABLE_HEADER_CONFIG } from './config/leads-table-header-config';
import { LeadStatusType } from './models/lead.model';
import { mapLeadStatusToPill } from './utils/lead-status.mapper';
import { LeadsService } from './leads.service';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { LEADS_BUTTON_CONFIG } from './config/button.config';

@Component({
  selector: 'aa-leads',
  standalone: true,
  imports: [TableComponent, PageTemplateComponent],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  private readonly leadsService = inject(LeadsService);

  readonly title = 'Leads';
  readonly subtitle = 'Manage and follow up with your open house leads here';

  readonly buttonConfig = LEADS_BUTTON_CONFIG;

  readonly tableHeaderConfig = LEADS_TABLE_HEADER_CONFIG;

  readonly tableData = computed(() =>
    this.leadsService.leads().map((lead) => ({
      ...lead,
      status: mapLeadStatusToPill(lead.status as LeadStatusType),
    })),
  );

  ngOnInit(): void {
    this.leadsService.getLeads();
  }

  onLeadExpanded(e: string) {}
}
