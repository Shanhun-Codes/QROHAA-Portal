import { DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.model';
export const JOIN_AGENCY_FORM_CONFIG: DynamicFormConfig = {
  fields: [
    {
      key: 'firstName',
      label: 'First name',
      type: 'text',
      required: true,
      layout: 'half',
      validation: { minLength: 2, maxLength: 50 },
    },
    {
      key: 'lastName',
      label: 'Last name',
      type: 'text',
      required: true,
      layout: 'half',
      validation: { minLength: 2, maxLength: 50 },
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'tel',
      required: true,
      layout: 'half',
      validation: { minLength: 10, maxLength: 20 },
    },
    {
      key: 'realEstateLicenseNumber',
      label: 'Real estate license number',
      type: 'text',
      required: true,
      layout: 'half',
    },
    {
      key: 'headline',
      label: 'Personal headline (optional)',
      type: 'text',
      layout: 'full',
    },
  ],
};
