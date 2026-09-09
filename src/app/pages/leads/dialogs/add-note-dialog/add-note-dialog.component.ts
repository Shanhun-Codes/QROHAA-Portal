import { Component, input } from '@angular/core';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';
import { ADD_NOTE_FORM_CONFIG } from '../../config/add-note-form.config';
import { AddNoteFormValue } from '../../models/note.model';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';

interface AddNoteDialogData {
  onSubmit: (note: string) => Promise<boolean>;
}

@Component({
  selector: 'aa-add-note-dialog',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './add-note-dialog.component.html',
  styleUrl: './add-note-dialog.component.scss',
})
export class AddNoteDialogComponent {
  readonly data = input.required<AddNoteDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly formConfig = ADD_NOTE_FORM_CONFIG;

  async onSubmit(values: unknown): Promise<void> {
    const formValues = values as AddNoteFormValue;
    const success = await this.data().onSubmit(formValues.note);
    console.log(formValues.note);

    if (success) {
      this.dialogRef().close();
    }
  }
}
