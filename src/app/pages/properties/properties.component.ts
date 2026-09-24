import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';

import { TableComponent } from '../../shared/components/table/table.component';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import {
  ViewToggleComponent,
  ViewToggleOption,
} from '../../shared/components/view-toggle/view-toggle.component';
import { BulkActionsBarComponent } from '../../shared/components/bulk-actions-bar/bulk-actions-bar.component';

import { PROPERTY_TABLE_HEADER_CONFIG } from './config/properties-table-header-config';
import {
  ARCHIVE_PROPERTY_BUTTON_CONFIG,
  PROPERTY_BUTTON_CONFIG,
  RESTORE_PROPERTY_BUTTON_CONFIG,
} from './config/button.config';
import { PropertiesService } from './properties.service';
import { PropertyTableRow } from './models/property.model';
import { formatListingPrice } from '../../shared/utils/format-listing-price.util';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';

type PropertyView = 'ACTIVE' | 'ARCHIVED';

@Component({
  selector: 'aa-properties',
  imports: [
    TableComponent,
    PageTemplateComponent,
    ButtonComponent,
    ViewToggleComponent,
    BulkActionsBarComponent,
  ],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent implements OnInit {
  private readonly propertyService = inject(PropertiesService);
  private readonly appLoaderService = inject(AppLoaderService);

  private readonly table = viewChild(TableComponent);

  readonly title = 'Properties';
  readonly subtitle = 'Manage your properties here';

  readonly tableHeaderConfig = PROPERTY_TABLE_HEADER_CONFIG;

  readonly selectedView = signal<PropertyView>('ACTIVE');
  readonly selectedPropertyIds = signal<string[]>([]);

  readonly viewOptions: ViewToggleOption[] = [
    {
      label: 'Active',
      value: 'ACTIVE',
    },
    {
      label: 'Archived',
      value: 'ARCHIVED',
    },
  ];

  readonly addPropertyButtonConfig = {
    ...PROPERTY_BUTTON_CONFIG,
    click: () => this.onAddPropertyClick(),
  };

  readonly bulkStatusButtonConfig = computed(() => ({
    ...(this.selectedView() === 'ACTIVE'
      ? ARCHIVE_PROPERTY_BUTTON_CONFIG
      : RESTORE_PROPERTY_BUTTON_CONFIG),
    click: () => this.onBulkStatusChange(),
  }));

  readonly tableData = computed<PropertyTableRow[]>(() =>
    this.propertyService
      .tableData()
      .filter((property) => property.status === this.selectedView())
      .map((property) => ({
        ...property,
        listingPrice: formatListingPrice(property.listingPriceCents),
      })),
  );

  ngOnInit(): void {
    this.appLoaderService.runInitialLoad(() =>
      this.propertyService.refreshProperties(),
    );
  }

  onViewChange(value: string): void {
    if (value !== 'ACTIVE' && value !== 'ARCHIVED') {
      return;
    }

    this.selectedView.set(value);
    this.clearSelection();
  }

  onSelectionChange(ids: string[]): void {
    this.selectedPropertyIds.set(ids);
  }

  clearSelection(): void {
    this.selectedPropertyIds.set([]);
    this.table()?.clearSelection();
  }

  async onBulkStatusChange(): Promise<void> {
    const ids = this.selectedPropertyIds();

    if (!ids.length) {
      return;
    }

    const status = this.selectedView() === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';

    const success = await this.propertyService.updatePropertyStatuses(
      ids,
      status,
    );

    if (success) {
      this.clearSelection();
    }
  }

  onAddPropertyClick(): void {
    this.propertyService.openPropertyDialog('CREATE');
  }
}
