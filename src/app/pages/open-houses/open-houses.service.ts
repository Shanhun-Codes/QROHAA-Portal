import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';

import { DialogService } from '../../shared/components/dialog/dialog.service';
import { DialogType } from '../leads/models/note.model';
import { OpenHouseDialogComponent } from './components/dialogs/open-house-dialog/open-house-dialog.component';
import { firstValueFrom } from 'rxjs';
import { OpenHousePreviewDialogComponent } from './components/dialogs/open-house-preview-dialog/open-house-preview-dialog.component';
import { CreateOpenHouseRequest, OpenHouse } from './models/open-house.model';

@Injectable({
  providedIn: 'root',
})
export class OpenHousesService {
  private readonly http = inject(HttpClient);
  private readonly dialogService = inject(DialogService);

  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  public tableData = signal<OpenHouse[]>([]);

  getOpenHouses() {
    return this.http.get<OpenHouse[]>(`${this.agentAppBaseUrl}/open-houses`);
  }

  createOpenHouse(values: CreateOpenHouseRequest) {
    return this.http.post<OpenHouse>(
      `${this.agentAppBaseUrl}/open-houses`,
      values,
    );
  }

  async openOpenHouseDialog(
    mode: DialogType,
    openHouse?: OpenHouse,
  ): Promise<void> {
    const dialogRef = this.dialogService.open({
      title: mode === 'CREATE' ? 'Open House Details' : 'Edit Open House',

      contentComponent: OpenHouseDialogComponent,

      data: {
        mode,
        openHouse,
      },

      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: mode === 'CREATE' ? 'Preview' : 'Preview Changes',
          type: 'primary',
          submit: true,
        },
      ],
    });

    const result = await dialogRef.afterClosed();

    if (!result) {
      return;
    }

    await this.openPreviewDialog(result as OpenHouse);
  }

  private async openPreviewDialog(openHouse: OpenHouse): Promise<void> {
    const dialogRef = this.dialogService.open({
      title: 'Open House Preview',

      contentComponent: OpenHousePreviewDialogComponent,

      data: {
        openHouse,
      },

      actions: [],
    });

    const result = await dialogRef.afterClosed();

    if (result === 'EDIT') {
      await this.openOpenHouseDialog('EDIT', openHouse);

      return;
    }

    if (result === 'CONFIRM') {
      await this.refreshOpenHouses();
    }
  }

  private async refreshOpenHouses(): Promise<void> {
    const openHouses = await firstValueFrom(this.getOpenHouses());

    this.tableData.set(openHouses);
  }

  updateOpenHouse(openHouseId: string, values: CreateOpenHouseRequest) {
    return this.http.patch<OpenHouse>(
      `${this.agentAppBaseUrl}/open-houses/${openHouseId}`,
      values,
    );
  }
}
