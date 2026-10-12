import { Component, input, computed } from '@angular/core';
import { LEAD_FORM_CONFIG } from '../../../config/lead-form.config';
import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';
import { DynamicFormComponent } from '../../../../../shared/components/dynamic-form/dynamic-form.component';
import { AddLeadFormValue } from '../../../models/lead.model';

interface AddLeadDialogData {
  lead?: AddLeadFormValue;
  onSubmit: (values: AddLeadFormValue) => Promise<boolean>;
}

@Component({
  selector: 'aa-add-lead-dialog',
  imports: [DynamicFormComponent],
  templateUrl: './lead-dialog.component.html',
  styleUrl: './lead-dialog.component.scss',
})
export class LeadDialogComponent {
  readonly data = input.required<AddLeadDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly formConfig = computed(() => ({
    ...LEAD_FORM_CONFIG,
    fields: LEAD_FORM_CONFIG.fields.map((field) => ({
      ...field,
      value:
        this.data().lead?.[field.key as keyof AddLeadFormValue] ?? field.value,
    })),
  }));

  async onSubmit(values: unknown): Promise<void> {
    const success = await this.data().onSubmit(values as AddLeadFormValue);

    if (success) {
      this.dialogRef().close();
    }
  }
}
