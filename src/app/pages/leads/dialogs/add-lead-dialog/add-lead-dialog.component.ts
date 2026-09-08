import { Component, input } from '@angular/core';
import { ADD_LEAD_FORM_CONFIG } from '../../config/add-lead-form.config';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'aa-add-lead-dialog',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './add-lead-dialog.component.html',
  styleUrl: './add-lead-dialog.component.scss',
})
export class AddLeadDialogComponent {
  readonly data = input<{ name: string }>();

  readonly formConfig = ADD_LEAD_FORM_CONFIG;

  readonly dialogRef = input.required<DialogRef<any>>();
}
