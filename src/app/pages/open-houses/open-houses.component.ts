import { Component, computed, inject, OnInit } from '@angular/core';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { OPEN_HOUSE_BUTTON_CONFIG } from './config/button.config';
import { OpenHousesService } from './open-houses.service';
import { TableComponent } from '../../shared/components/table/table.component';
import { OPEN_HOUSE_TABLE_HEADER_CONFIG } from './config/open-houses-table-header.config';

import { mapOpenHouseToTableRow } from './utils/open-house-table.util';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLoaderService } from '../../shared/components/app-loader/app-loader.service';

@Component({
  selector: 'aa-open-houses',
  standalone: true,
  imports: [PageTemplateComponent, TableComponent, ButtonComponent],
  templateUrl: './open-houses.component.html',
  styleUrl: './open-houses.component.scss',
})
export class OpenHousesComponent implements OnInit {
  private readonly openHouseService = inject(OpenHousesService);
  private readonly appLoaderService = inject(AppLoaderService);

  readonly title = 'Open Houses';
  readonly subtitle = 'Manage your open houses here';
  readonly tableHeaderConfig = OPEN_HOUSE_TABLE_HEADER_CONFIG;

  readonly addOpenHouseButtonConfig = {
    ...OPEN_HOUSE_BUTTON_CONFIG,
    click: () => this.onCreateNewOpenHouseClick(),
  };

  readonly tableData = computed(() =>
    this.openHouseService.tableData().map(mapOpenHouseToTableRow),
  );

  ngOnInit(): void {
    this.appLoaderService.runInitialLoad(
      () =>
        new Promise<void>((resolve) => {
          const request = this.openHouseService.getOpenHouses();

          if (!request) {
            resolve();
            return;
          }

          request.subscribe({
            next: (response) => {
              this.openHouseService.tableData.set(
                response.map((openHouse) => ({
                  ...openHouse,
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

  onCreateNewOpenHouseClick() {
    this.openHouseService.openOpenHouseDialog('CREATE');
  }

  onLeadExpanded(e: string) {}
}
