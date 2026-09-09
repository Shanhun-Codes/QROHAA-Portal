import { Component, computed, input, signal } from '@angular/core';
import { DialogRef } from '../../../../shared/components/dialog/dialog-ref';
import { ADD_NOTE_FORM_CONFIG } from '../../config/add-note-form.config';
import { AddNoteFormValue, NoteDialogData } from '../../models/note.model';
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
export class NoteDialogComponent {
  readonly data = input.required<NoteDialogData>();
  readonly dialogRef = input.required<DialogRef<any>>();

  readonly formConfig = computed(() => ({
    ...ADD_NOTE_FORM_CONFIG,
    fields: ADD_NOTE_FORM_CONFIG.fields.map((field) =>
      field.key === 'note'
        ? {
            ...field,
            value: this.data().noteBody ?? '',
          }
        : field,
    ),
  }));

  async onSubmit(values: unknown): Promise<void> {
    const formValues = values as AddNoteFormValue;

    const success = await this.data().onSubmit(formValues.note);

    if (success) {
      this.dialogRef().close();
    }
  }
}
