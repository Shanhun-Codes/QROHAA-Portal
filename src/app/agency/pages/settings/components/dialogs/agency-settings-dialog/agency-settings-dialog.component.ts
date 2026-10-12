import { SettingsDialogData } from './agency-settings-dialog.model';
import { AgencySettingsUpdate } from '../../../agency-settings.model';
import { buildAgencySettingsForm } from '../../../config/agency-settings-form.config';
import { Component, computed, input, signal } from '@angular/core';
import { DynamicFormComponent } from '../../../../../../shared/components/dynamic-form/dynamic-form.component';
import { DialogRef } from '../../../../../../shared/components/dialog/dialog-ref';
@Component({
  selector: 'aa-agency-settings-dialog',
  imports: [DynamicFormComponent],
  templateUrl: './agency-settings-dialog.component.html',
})
export class AgencySettingsDialogComponent {
  readonly data = input.required<SettingsDialogData>();
  readonly dialogRef = input.required<DialogRef<void>>();
  readonly saving = signal(false);
  readonly config = computed(() =>
    buildAgencySettingsForm(this.data().settings, this.data().mode),
  );
  async save(value: unknown) {
    if (this.saving()) return;
    const values = value as Record<string, string>;
    const text = (key: string) => values[key]?.trim() || null;
    let payload: AgencySettingsUpdate;
    if (this.data().mode === 'BRANDING') {
      payload = {
        name: values['name'].trim(),
        headline: text('headline'),
        primaryColor: text('primaryColor'),
        secondaryColor: text('secondaryColor'),
        accentColor: text('accentColor'),
      };
    } else {
      payload = {
        brokerage: {
          name: values['brokerageName'].trim(),
          licenseNumber: text('brokerageLicenseNumber'),
          phone: text('brokeragePhone'),
          email: text('brokerageEmail'),
          websiteUrl: text('brokerageWebsiteUrl'),
          address: {
            street: text('brokerageStreet'),
            street2: text('brokerageStreet2'),
            city: text('brokerageCity'),
            state: text('brokerageState'),
            zip: text('brokerageZip'),
          },
        },
      };
    }
    this.saving.set(true);
    try {
      if (await this.data().save(payload)) this.dialogRef().close();
    } finally {
      this.saving.set(false);
    }
  }
}
