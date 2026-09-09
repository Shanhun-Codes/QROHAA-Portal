import { DynamicFormConfig } from '../../../shared/components/models/dynamic-form.model';

export const ADD_NOTE_FORM_CONFIG: DynamicFormConfig = {
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
      value: '',
      validation: {
        minLength: 2,
        maxLength: 1000,
      },
    },
  ],
};
