import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../shared/services/auth-service';
import { environment } from '../../../environments/environment';
import { OpenHouse, OpenHouseFormValue } from './models/open-house.model';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { DialogType } from '../leads/models/note.model';
import { OpenHouseDialogComponent } from './components/dialogs/open-house-dialog/open-house-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class OpenHousesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = this.authService.agentId;
  public tableData = signal<OpenHouse[]>([]);

  getOpenHouses() {
    return this.http.get<OpenHouse[]>(
      `${this.baseUrl}/agents/${this.agentId()}/open-houses`,
    );
  }

  createOpenHouse(values: OpenHouseFormValue) {
    // Implement the logic to create an open house here
  }

  async openOpenHouseDialog(
    mode: DialogType,
    OpenHouseIdId?: string,
  ): Promise<void> {
    this.dialogService.open({
      title: 'Open House Details',
      contentComponent: OpenHouseDialogComponent,
      data: {
        onSubmit: (values: OpenHouseFormValue) => this.createOpenHouse(values),
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: mode === 'CREATE' ? 'Preview' : 'Update',
          type: 'primary',
          submit: true,
        },
      ],
    });
  }
}
