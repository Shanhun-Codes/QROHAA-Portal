import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { SnackbarService } from '../../shared/components/snackbar/snackbar.service';
import { DialogType } from '../leads/models/note.model';
import { PropertyDialogComponent } from './components/property-dialog/property-dialog.component';
import {
  Property,
  PropertyFormValue,
  PropertyStatus,
} from './models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private readonly http = inject(HttpClient);
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly agentAppBaseUrl = environment.agentAppApiUrl;

  readonly tableData = signal<Property[]>([]);

  getProperties() {
    return this.http.get<Property[]>(`${this.agentAppBaseUrl}/properties`);
  }

  async refreshProperties(): Promise<void> {
    const properties = await firstValueFrom(this.getProperties());
    this.tableData.set(properties);
  }

  async createProperty(data: PropertyFormValue): Promise<Property | null> {
    const payload = this.buildPropertyPayload(data);

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

  async updateProperty(
    propertyId: string,
    data: PropertyFormValue,
  ): Promise<boolean> {
    const payload = this.buildPropertyPayload(data);

    try {
      const updatedProperty = await firstValueFrom(
        this.http.patch<Property>(
          `${this.agentAppBaseUrl}/properties/${propertyId}`,
          payload,
        ),
      );

      this.tableData.update((properties) =>
        properties.map((property) =>
          property.id === updatedProperty.id ? updatedProperty : property,
        ),
      );

      this.snackbarService.success('Property successfully updated');

      return true;
    } catch (error) {
      console.error('Failed to update property:', error);

      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async updatePropertyStatus(
    propertyId: string,
    status: PropertyStatus,
  ): Promise<boolean> {
    try {
      const updatedProperty = await firstValueFrom(
        this.http.patch<Property>(
          `${this.agentAppBaseUrl}/properties/${propertyId}`,
          { status },
        ),
      );

      this.tableData.update((properties) =>
        properties.map((property) =>
          property.id === updatedProperty.id ? updatedProperty : property,
        ),
      );

      this.snackbarService.success(
        status === 'ARCHIVED' ? 'Property archived' : 'Property restored',
      );

      return true;
    } catch (error) {
      console.error('Failed to update property status:', error);

      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async openPropertyDialog(
    mode: DialogType,
    property?: Property,
  ): Promise<void> {
    this.dialogService.open({
      title: mode === 'CREATE' ? 'Create Property' : 'Property Details',
      contentComponent: PropertyDialogComponent,
      data: {
        property,
        onSubmit: (values: PropertyFormValue) => {
          if (mode === 'EDIT' && property) {
            return this.updateProperty(property.id, values);
          }

          return this.createProperty(values);
        },
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

  private buildPropertyPayload(data: PropertyFormValue) {
    return {
      ...data,
      listingPriceCents: data.listingPrice
        ? Math.round(Number(data.listingPrice) * 100)
        : null,
    };
  }

  async updatePropertyStatuses(
    propertyIds: string[],
    status: PropertyStatus,
  ): Promise<boolean> {
    try {
      await Promise.all(
        propertyIds.map((propertyId) =>
          firstValueFrom(
            this.http.patch<Property>(
              `${this.agentAppBaseUrl}/properties/${propertyId}`,
              { status },
            ),
          ),
        ),
      );

      this.tableData.update((properties) =>
        properties.map((property) =>
          propertyIds.includes(property.id)
            ? { ...property, status }
            : property,
        ),
      );

      this.snackbarService.success(
        status === 'ARCHIVED'
          ? 'Properties successfully archived'
          : 'Properties successfully restored',
      );

      return true;
    } catch (error) {
      console.error('Failed to update properties:', error);

      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }
}
