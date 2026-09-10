import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/auth-service';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { DialogType } from '../leads/models/note.model';
import { PropertyDialogComponent } from './components/property-dialog/property-dialog.component';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { Property, PropertyFormValue } from './models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = this.authService.agentId;
  public tableData = signal<Property[]>([]);

  public getProperties() {
    if (!this.agentId()) {
      return;
    }
    return this.http.get<any>(
      `${this.baseUrl}/agents/${this.agentId()}/properties`,
    );
  }

  async updateProperty(
    propertyId: string,
    data: PropertyFormValue,
  ): Promise<boolean> {
    const payload = {
      ...data,
      listingPriceCents: data.listingPrice
        ? Math.round(Number(data.listingPrice) * 100)
        : null,
      agentId: this.agentId(),
    };

    try {
      await firstValueFrom(
        this.http.patch<Property>(
          `${this.baseUrl}/agents/${this.agentId()}/properties/${propertyId}`,
          payload,
        ),
      );

      this.snackbarService.success('Property successfully updated');

      this.getProperties()?.subscribe((response) => {
        this.tableData.set(
          response.map((Property: Property) => ({
            ...Property,
          })),
        );
      });

      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async createProperty(data: PropertyFormValue): Promise<boolean> {
    const payload = {
      ...data,
      listingPriceCents: data.listingPrice
        ? Math.round(Number(data.listingPrice) * 100)
        : null,
      agentId: this.agentId(),
    };

    try {
      await firstValueFrom(
        this.http.post<Property>(
          `${this.baseUrl}/agents/${this.agentId()}/properties`,
          payload,
        ),
      );

      this.snackbarService.success('Property successfully created');

      this.getProperties()?.subscribe((response) => {
        this.tableData.set(
          response.map((Property: Property) => ({
            ...Property,
          })),
        );
      });
      console.log('AFTER HTTP', payload);

      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async openPropertyDialog(
    mode: DialogType,
    propertyId?: string,
  ): Promise<void> {
    this.dialogService.open({
      title: 'Property Details',
      contentComponent: PropertyDialogComponent,
      data: {
        onSubmit: (values: PropertyFormValue) => this.createProperty(values),
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: mode === 'CREATE' ? 'Create' : 'Update',
          type: 'primary',
          submit: true,
        },
      ],
    });
  }
}
