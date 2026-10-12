import { Component, input, computed } from '@angular/core';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { PropertyFormValue } from '../../property.model';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';
import { PROPERTY_FORM_CONFIG } from '../../config/property-form.config';

interface PropertydDialogData {
  property?: import('../../property.model').Property;
  onSubmit: (values: PropertyFormValue) => Promise<boolean>;
}

@Component({
  selector: 'aa-property-dialog',
  imports: [DynamicFormComponent],
  templateUrl: './property-dialog.component.html',
  styleUrl: './property-dialog.component.scss',
})
export class PropertyDialogComponent {
  readonly data = input.required<PropertydDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly formConfig = computed(() => ({
    ...PROPERTY_FORM_CONFIG,
    fields: PROPERTY_FORM_CONFIG.fields.map((field) => ({
      ...field,
      value:
        field.key === 'listingPrice'
          ? this.data().property?.listingPriceCents != null
            ? this.data().property!.listingPriceCents! / 100
            : null
          : ((
              this.data().property as unknown as
                Record<string, string> | undefined
            )?.[field.key] ?? field.value),
    })),
  }));

  async onSubmit(values: unknown): Promise<void> {
    const success = await this.data().onSubmit(values as PropertyFormValue);

    if (success) {
      this.dialogRef().close();
    }
  }
}
