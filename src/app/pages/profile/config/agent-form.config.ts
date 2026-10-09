import { DynamicFormConfig } from '../../../shared/components/dynamic-form/dynamic-form.model';
import { AgentProfileFormValues } from '../profile-form.model';

export const AGENT_FORM_CONFIG: DynamicFormConfig<AgentProfileFormValues> = {
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
      key: 'realEstateLicenseNumber',
      label: 'license #',
      type: 'text',
      required: true,
      layout: 'half',
      placeholder: 'Enter your real estate license number',
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

export const BROKERAGE_FORM_CONFIG: DynamicFormConfig<AgentProfileFormValues> =
  {
    fields: [
      {
        key: 'brokerageName',
        label: 'Brokerage Name',
        type: 'text',
        layout: 'full',
      },
      {
        key: 'brokerageLicenseNumber',
        label: 'Brokerage License Number',
        type: 'text',
        layout: 'half',
      },
      {
        key: 'brokerageStreet',
        label: 'Street Address',
        type: 'text',
        layout: 'half',
      },
      {
        key: 'brokerageStreet2',
        label: 'Address Line 2',
        type: 'text',
        layout: 'half',
      },
      {
        key: 'brokerageCity',
        label: 'City',
        type: 'text',
        layout: 'half',
      },
      {
        key: 'brokerageState',
        label: 'State',
        type: 'text',
        layout: 'quarter',
      },
      {
        key: 'brokerageZip',
        label: 'ZIP Code',
        type: 'text',
        layout: 'quarter',
      },
      {
        key: 'brokeragePhone',
        label: 'Brokerage Phone',
        type: 'tel',
        layout: 'half',
      },
      {
        key: 'brokerageEmail',
        label: 'Brokerage Email',
        type: 'email',
        layout: 'half',
        validation: { email: true },
        validationMessages: { email: 'Enter a valid email address.' },
      },
      {
        key: 'brokerageWebsiteUrl',
        label: 'Brokerage Website',
        type: 'text',
        layout: 'full',
        placeholder: 'https://example.com',
        validation: {
          pattern:
            '^https?:\\/\\/(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:[/?#][^\\s]*)?$',
        },
        validationMessages: { pattern: 'Enter a valid website URL.' },
      },
    ],
  };

export const BRANDING_FORM_CONFIG: DynamicFormConfig<AgentProfileFormValues> = {
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
