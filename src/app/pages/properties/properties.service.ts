import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { DialogType } from '../leads/models/note.model';
import { PropertyDialogComponent } from './components/property-dialog/property-dialog.component';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { Property, PropertyFormValue } from './models/property.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  public tableData = signal<Property[]>([]);

  public getProperties() {
    return this.http.get<any>(`${this.agentAppBaseUrl}/properties`);
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
    };

    try {
      await firstValueFrom(
        this.http.patch<Property>(
          `${this.agentAppBaseUrl}/properties/${propertyId}`,
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

  async createProperty(data: PropertyFormValue): Promise<Property | null> {
    const payload = {
      ...data,
      listingPriceCents: data.listingPrice
        ? Math.round(Number(data.listingPrice) * 100)
        : null,
    };

    try {
      const property = await firstValueFrom(
        this.http.post<Property>(`${this.agentAppBaseUrl}/properties`, payload),
      );

      this.tableData.update((properties) => [property, ...properties]);

      this.snackbarService.success('Property successfully created');

      return property;
    } catch (error) {
      console.error('Failed to create property:', error);

      this.snackbarService.error('An error occurred, please try again');

      return null;
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
