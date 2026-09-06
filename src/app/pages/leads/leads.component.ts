import { Component, computed, inject, OnInit } from '@angular/core';

import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { LEAD_TABLE_HEADER_CONFIG } from './config/leads-table-header-config';
import { LeadStatusType } from './models/lead.model';
import { mapLeadStatusToPill } from './utils/lead-status.mapper';
import { LeadsService } from './leads.service';

@Component({
  selector: 'aa-leads',
  standalone: true,
  imports: [ButtonComponent, TableComponent],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  private readonly leadsService = inject(LeadsService);

  readonly title = 'Leads';
  readonly subTitle = 'Manage and follow up with your open house leads here';

  readonly tableHeaderConfig = LEAD_TABLE_HEADER_CONFIG;

  readonly tableData = computed(() =>
    this.leadsService.leads().map((lead) => ({
      ...lead,
      status: mapLeadStatusToPill(lead.status as LeadStatusType),
    })),
  );

  ngOnInit(): void {
    this.leadsService.getLeads();
  }
}
