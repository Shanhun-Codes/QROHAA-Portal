import { DynamicFormConfig } from '../../../shared/components/models/dynamic-form.model';
import { Note } from '../models/note.model';

export const NOTE_FORM_CONFIG: DynamicFormConfig<NoteFormValue> = {
  layout: {
    gap: 'md',
    labelPosition: 'top',
  },

  fields: [
    {
      key: 'note',
      label: 'Message',
      type: 'textarea',
      layout: 'full',
      required: true,
      placeholder: 'Enter note details here...',
      validation: {
        minLength: 2,
        maxLength: 1000,
      },
    },
  ],
};

export interface NoteFormValue {
  note: string;
}
