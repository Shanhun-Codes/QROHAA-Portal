import { AgentProfile } from '../../../auth/auth.model';
import { DynamicFormConfig } from '../../../shared/components/models/dynamic-form.model';

export const AGENT_FORM_CONFIG: DynamicFormConfig<AgentProfile> = {
  fields: [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      layout: 'half',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      layout: 'half',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      layout: 'half',
      validation: {
        email: true,
      },
      validationMessages: {
        email: 'Enter a valid email address',
      },
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'tel',
      required: true,
      layout: 'half',
      placeholder: '4175551234',
    },
    {
      key: 'brokerageName',
      label: 'Brokerage',
      type: 'text',
      layout: 'full',
    },
    {
      key: 'headline',
      label: 'Headline',
      type: 'textarea',
      layout: 'full',
      helperText: 'This can appear on your public open house page.',
    },
  ],
};

export const BRANDING_FORM_CONFIG: DynamicFormConfig<AgentProfile> = {
  fields: [
    {
      key: 'primaryColor',
      label: 'Primary Color',
      type: 'text',
      layout: 'third',
      placeholder: '#111820',
      tooltip:
        'HEX codes represent colors using values like #B10F0F. If you do not know your brand colors, upload your logo or branding image to an AI assistant and ask it for your primary, secondary, and accent HEX color codes.',
    },
    {
      key: 'secondaryColor',
      label: 'Secondary Color',
      type: 'text',
      layout: 'third',
      placeholder: '#7F1D1D',
    },
    {
      key: 'accentColor',
      label: 'Accent Color',
      type: 'text',
      layout: 'third',
      placeholder: '#DC2626',
    },
  ],
};
