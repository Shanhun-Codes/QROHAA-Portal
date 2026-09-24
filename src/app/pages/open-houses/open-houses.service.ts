import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';

import { DialogService } from '../../shared/components/dialog/dialog.service';
import { DialogType } from '../leads/models/note.model';
import { OpenHouseDialogComponent } from './components/dialogs/open-house-dialog/open-house-dialog.component';
import { firstValueFrom } from 'rxjs';
import { OpenHousePreviewDialogComponent } from './components/dialogs/open-house-preview-dialog/open-house-preview-dialog.component';
import {
  CreateOpenHouseRequest,
  DeleteOpenHousesResponse,
  OpenHouse,
  OpenHouseDetail,
} from './models/open-house.model';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class OpenHousesService {
  private readonly http = inject(HttpClient);
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);

  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  public tableData = signal<OpenHouse[]>([]);
  readonly selectedOpenHouseIds = signal<string[]>([]);

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
    openHouse?: OpenHouse | OpenHouseDetail,
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

  async removeBulkOpenHouses(openHouseIds: string[]): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.delete<DeleteOpenHousesResponse>(
          `${this.agentAppBaseUrl}/open-houses`,
          {
            body: openHouseIds,
          },
        ),
      );

      this.tableData.set(response.openHouses);

      if (response.skippedCount > 0) {
        this.snackbarService.success(
          `${response.deletedCount} ${
            response.deletedCount === 1 ? 'open house' : 'open houses'
          } deleted. ${response.skippedCount} ${
            response.skippedCount === 1 ? 'was' : 'were'
          } preserved because ${
            response.skippedCount === 1 ? 'it contains' : 'they contain'
          } feedback.`,
        );
      } else {
        this.snackbarService.success(
          `${response.deletedCount} ${
            response.deletedCount === 1 ? 'open house' : 'open houses'
          } successfully deleted`,
        );
      }

      return true;
    } catch {
      this.snackbarService.error(
        'Unable to delete the selected open houses. Open houses containing feedback cannot be deleted.',
      );

      return false;
    }
  }

  async downloadFeedbackForm(openHouseId: string): Promise<void> {
    try {
      const pdf = await firstValueFrom(
        this.http.get(
          `${this.agentAppBaseUrl}/open-houses/${openHouseId}/feedback-form/pdf`,
          {
            responseType: 'blob',
          },
        ),
      );

      const url = URL.createObjectURL(pdf);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'open-house-feedback-form.pdf';

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      this.snackbarService.error(
        'Unable to download the feedback form. Please try again.',
      );
    }
  }

  async downloadFlyer(openHouseId: string): Promise<void> {
    try {
      const pdf = await firstValueFrom(
        this.http.get(
          `${this.agentAppBaseUrl}/open-houses/${openHouseId}/flyer/pdf`,
          {
            responseType: 'blob',
          },
        ),
      );

      const url = URL.createObjectURL(pdf);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'open-house-flyer.pdf';

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch {
      this.snackbarService.error(
        'Unable to download the open house flyer. Please try again.',
      );
    }
  }
}
