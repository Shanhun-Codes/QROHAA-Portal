import { DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.model';
export const INVITE_AGENT_FORM_CONFIG: DynamicFormConfig = {
  fields: [
    {
      key: 'email',
      label: 'Invitation email',
      type: 'email',
      required: true,
      layout: 'full',
      validation: { email: true },
    },
    {
      key: 'role',
      label: 'Access level',
      type: 'select',
      required: true,
      value: 'AGENT',
      layout: 'full',
      options: [
        { label: 'Agent', value: 'AGENT' },
        { label: 'Agency Administrator', value: 'AGENCY_ADMIN' },
      ],
    },
  ],
};
