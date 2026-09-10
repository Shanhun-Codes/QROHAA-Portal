import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { PROPERTY_TABLE_HEADER_CONFIG } from './config/properties-table-header-config';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { PropertiesService } from './properties.service';
import { formatListingPrice } from '../../shared/utils/format-listing-price.util';
import { Property, PropertyTableRow } from './models/property.model';
import { PROPERTY_BUTTON_CONFIG } from './config/button.config';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { NgTemplateOutlet } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'aa-properties',
  standalone: true,
  imports: [TableComponent, PageTemplateComponent, ButtonComponent],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss',
})
export class PropertiesComponent implements OnInit {
  private readonly propertyService = inject(PropertiesService);
  private readonly appLoaderService = inject(AppLoaderService);

  readonly title = 'Properties';
  readonly subtitle = 'Manage your properties here';

  readonly tableHeaderConfig = PROPERTY_TABLE_HEADER_CONFIG;

  readonly addPropertyButtonConfig = {
    ...PROPERTY_BUTTON_CONFIG,
    click: () => this.onAddPropertyClick(),
  };

  readonly tableData = computed<PropertyTableRow[]>(() =>
    this.propertyService.tableData().map((data) => ({
      ...data,
      listingPrice: formatListingPrice(data.listingPriceCents),
    })),
  );

  ngOnInit(): void {
    const minimumDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, 1500),
    );

    const fontsReady = document.fonts.ready;

    const leadsRequest = new Promise<void>((resolve) => {
      const request = this.propertyService.getProperties();

      if (!request) {
        resolve();
        return;
      }

      request.subscribe({
        next: (response) => {
          this.propertyService.tableData.set(
            response.map((property: Property) => ({
              ...property,
            })),
          );

          resolve();
        },
        error: () => {
          resolve();
        },
      });
    });

    if (!this.appLoaderService.isAppLoading()) {
      return;
    }

    Promise.all([leadsRequest, minimumDelay, fontsReady]).finally(() => {
      this.appLoaderService.stopLoading();
    });
  }

  onAddPropertyClick() {
    this.propertyService.openPropertyDialog('CREATE');
  }

  onLeadExpanded(e: string) {}
}
