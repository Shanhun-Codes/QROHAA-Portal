import { DynamicFormConfig } from '../../../shared/components/models/dynamic-form.model';

export const ADD_LEAD_FORM_CONFIG: DynamicFormConfig = {
  layout: {
    gap: 'md',
    labelPosition: 'top',
  },

  fields: [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      layout: 'half',
      required: true,
      placeholder: 'Enter first name',
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      layout: 'half',
      required: true,
      placeholder: 'Enter last name',
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      layout: 'half',
      placeholder: 'Enter email address',
      validation: {
        email: true,
        maxLength: 100,
      },
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'tel',
      layout: 'half',
      placeholder: 'Enter phone number',
      validation: {
        minLength: 10,
        maxLength: 20,
      },
    },
  ],
};
