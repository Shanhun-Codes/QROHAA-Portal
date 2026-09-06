import { Component, computed, inject, OnInit } from '@angular/core';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { OPEN_HOUSE_BUTTON_CONFIG } from './config/button.config';
import { OpenHousesService } from './open-houses.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { OPEN_HOUSE_TABLE_HEADER_CONFIG } from './config/open-houses-table-header.config';
import { formatListingPrice } from '../../shared/utils/format-listing-price.util';
import { formatDate } from '@angular/common';
import { formatDateTime } from '../../shared/utils/format-date-time.util';
import { mapOpenHouseToTableRow } from './utils/open-house-table.util';

@Component({
  selector: 'aa-open-houses',
  standalone: true,
  imports: [PageTemplateComponent, TableComponent],
  templateUrl: './open-houses.component.html',
  styleUrl: './open-houses.component.scss',
})
export class OpenHousesComponent implements OnInit {
  private readonly openHousesService = inject(OpenHousesService);

  readonly title = 'Open Houses';
  readonly subtitle = 'Manage your open houses here';
  readonly tableHeaderConfig = OPEN_HOUSE_TABLE_HEADER_CONFIG;
  readonly buttonConfig = OPEN_HOUSE_BUTTON_CONFIG;

  readonly tableData = computed(() =>
    this.openHousesService.tableData().map(mapOpenHouseToTableRow),
  );

  ngOnInit(): void {
    this.openHousesService.getOpenHouseData();
  }

  onLeadExpanded(e: string) {}
}
