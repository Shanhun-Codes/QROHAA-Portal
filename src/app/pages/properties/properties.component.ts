import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { PROPERTY_TABLE_HEADER_CONFIG } from './config/properties-table-header-config';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { PropertiesService } from './properties.service';
import { formatListingPrice } from '../../shared/utils/format-listing-price.util';
import { PropertyTableRow } from './models/property.model';
import { PROPERTY_BUTTON_CONFIG } from './config/button.config';

@Component({
  selector: 'aa-properties',
  standalone: true,
  imports: [TableComponent, PageTemplateComponent],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent implements OnInit {
  private readonly propertyService = inject(PropertiesService);

  readonly title = 'Properties';
  readonly subtitle = 'Manage your properties here';

  readonly tableHeaderConfig = PROPERTY_TABLE_HEADER_CONFIG;
  readonly buttonConfig = PROPERTY_BUTTON_CONFIG;

  readonly tableData = computed<PropertyTableRow[]>(() =>
    this.propertyService.tableData().map((data) => ({
      ...data,
      listingPrice: formatListingPrice(data.listingPriceCents),
    })),
  );

  ngOnInit(): void {
    this.propertyService.getPropertyData();
  }

  onLeadExpanded(e: string) {}
}
