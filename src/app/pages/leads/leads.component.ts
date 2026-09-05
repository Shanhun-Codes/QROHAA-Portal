import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { LEAD_DUMMY_DATA } from './config/table-dummy-data.config';
import { LEAD_TABLE_HEADER_CONFIG } from './config/leads-table-header-config';
import { LeadStatusType } from './models/lead.model';
import { mapLeadStatusToPill } from './utils/lead-status.mapper';

@Component({
  selector: 'aa-leads',
  standalone: true,
  imports: [ButtonComponent, TableComponent],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent {
  readonly title = 'Leads';
  readonly subTitle = 'Manage and follow up with your open house leads here';
  readonly tableHeaderConfig = LEAD_TABLE_HEADER_CONFIG;
  readonly tableDataConfig = LEAD_DUMMY_DATA;

  public tableData = LEAD_DUMMY_DATA.map((lead) => ({
    ...lead,
    status: mapLeadStatusToPill(lead.status as LeadStatusType),
  }));
}
