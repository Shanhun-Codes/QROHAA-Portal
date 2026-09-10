import { Component, input } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { PropertyFormValue } from '../../models/property.model';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';
import { PROPERTY_FORM_CONFIG } from '../../config/property-form.config';

interface PropertydDialogData {
  onSubmit: (values: PropertyFormValue) => Promise<boolean>;
}

@Component({
  selector: 'aa-property-dialog',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './property-dialog.component.html',
  styleUrl: './property-dialog.component.scss',
})
export class PropertyDialogComponent {
  readonly data = input.required<PropertydDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly formConfig = PROPERTY_FORM_CONFIG;

  async onSubmit(values: unknown): Promise<void> {
    const success = await this.data().onSubmit(values as PropertyFormValue);

    if (success) {
      this.dialogRef().close();
    }
  }
}
