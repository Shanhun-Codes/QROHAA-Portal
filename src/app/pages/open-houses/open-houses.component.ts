import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { TableComponent } from '../../shared/components/table/table.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';
import {
  ViewToggleComponent,
  ViewToggleOption,
} from '../../shared/components/view-toggle/view-toggle.component';
import { BulkActionsBarComponent } from '../../shared/components/bulk-actions-bar/bulk-actions-bar.component';

import {
  DELETE_OPEN_HOUSE_BUTTON_CONFIG,
  OPEN_HOUSE_BUTTON_CONFIG,
} from './config/button.config';
import { OPEN_HOUSE_TABLE_HEADER_CONFIG } from './config/open-houses-table-header.config';

import { OpenHousesService } from './open-houses.service';
import { OpenHouseExpandedRowComponent } from './components/open-house-expanded-row/open-house-expanded-row.component';

import { mapOpenHouseToTableRow } from './utils/open-house-table.util';
import { OpenHouseView } from './models/open-house.model';

@Component({
  selector: 'aa-open-houses',
  imports: [
    PageTemplateComponent,
    TableComponent,
    ButtonComponent,
    OpenHouseExpandedRowComponent,
    ViewToggleComponent,
    BulkActionsBarComponent,
  ],
  templateUrl: './open-houses.component.html',
  styleUrl: './open-houses.component.scss',
})
export class OpenHousesComponent implements OnInit {
  private readonly openHouseService = inject(OpenHousesService);
  private readonly appLoaderService = inject(AppLoaderService);

  readonly title = 'Open Houses';
  readonly subtitle = 'Manage your open houses here';

  readonly tableHeaderConfig = OPEN_HOUSE_TABLE_HEADER_CONFIG;

  readonly selectedOpenHouseIds = this.openHouseService.selectedOpenHouseIds;

  readonly openHouseView = signal<OpenHouseView>('UPCOMING');

  readonly openHouseViewOptions: ViewToggleOption[] = [
    {
      label: 'Upcoming',
      value: 'UPCOMING',
    },
    {
      label: 'Past',
      value: 'PAST',
    },
  ];

  readonly addOpenHouseButtonConfig = {
    ...OPEN_HOUSE_BUTTON_CONFIG,
    click: () => this.onCreateNewOpenHouseClick(),
  };

  readonly bulkDeleteButtonConfig = {
    ...DELETE_OPEN_HOUSE_BUTTON_CONFIG,
    click: () => void this.onBulkDelete(),
  };

  readonly tableData = computed(() => {
    const view = this.openHouseView();
    const now = new Date();

    return this.openHouseService
      .tableData()
      .filter((openHouse) => {
        const isPast = new Date(openHouse.endsAt) < now;

        return view === 'PAST' ? isPast : !isPast;
      })
      .map(mapOpenHouseToTableRow);
  });

  ngOnInit(): void {
    this.appLoaderService.runInitialLoad(
      () =>
        new Promise<void>((resolve) => {
          const request = this.openHouseService.getOpenHouses();

          request.subscribe({
            next: (response) => {
              this.openHouseService.tableData.set(response);

              resolve();
            },
            error: () => {
              resolve();
            },
          });
        }),
    );
  }

  onOpenHouseViewChange(value: string): void {
    if (value !== 'UPCOMING' && value !== 'PAST') {
      return;
    }

    this.openHouseView.set(value);
    this.selectedOpenHouseIds.set([]);
  }

  onSelectionChange(openHouseIds: string[]): void {
    this.selectedOpenHouseIds.set(openHouseIds);
  }

  onClearSelectionClick(): void {
    this.selectedOpenHouseIds.set([]);
  }

  onCreateNewOpenHouseClick(): void {
    void this.openHouseService.openOpenHouseDialog('CREATE');
  }

  onOpenHouseExpanded(openHouseId: string): void {}

  private async onBulkDelete(): Promise<void> {
    const openHouseIds = this.selectedOpenHouseIds();

    if (!openHouseIds.length) {
      return;
    }

    const success =
      await this.openHouseService.removeBulkOpenHouses(openHouseIds);

    if (success) {
      this.selectedOpenHouseIds.set([]);
    }
  }
}
