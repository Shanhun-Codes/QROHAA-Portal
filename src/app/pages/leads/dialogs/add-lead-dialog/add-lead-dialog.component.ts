import { Component, input } from '@angular/core';
import { ADD_LEAD_FORM_CONFIG } from '../../config/add-lead-form.config';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { AddLeadFormValue } from '../../models/lead.model';

interface AddLeadDialogData {
  onSubmit: (values: AddLeadFormValue) => Promise<boolean>;
}

@Component({
  selector: 'aa-add-lead-dialog',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './add-lead-dialog.component.html',
  styleUrl: './add-lead-dialog.component.scss',
})
export class AddLeadDialogComponent {
  readonly data = input.required<AddLeadDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly formConfig = ADD_LEAD_FORM_CONFIG;

  async onSubmit(values: unknown): Promise<void> {
    const success = await this.data().onSubmit(values as AddLeadFormValue);

    if (success) {
      this.dialogRef().close();
    }
  }
}
