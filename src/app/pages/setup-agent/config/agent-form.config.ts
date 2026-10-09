import { ButtonConfig } from '../../../shared/components/button/button.config';
import { DynamicFormConfig } from '../../../shared/components/dynamic-form/dynamic-form.model';
import { AgentSetupFormValues } from '../setup-agent.model';

const usPhonePattern =
  '^(?:\\+?1[ .-]?)?\\(?[2-9][0-9]{2}\\)?[ .-]?[2-9][0-9]{2}[ .-]?[0-9]{4}$';
const hexColorPattern =
  '^#?(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$';
const websiteUrlPattern =
  '^https?:\\/\\/(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:[/?#][^\\s]*)?$';

export const AGENT_FORM_CONFIG: DynamicFormConfig<AgentSetupFormValues> = {
  layout: {
    gap: 'md',
    labelPosition: 'top',
  },

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
      validation: {
        pattern: usPhonePattern,
      },
      validationMessages: {
        pattern: 'Enter a valid US phone number.',
      },
    },
    {
      key: 'realEstateLicenseNumber',
      label: 'Real Estate License Number',
      type: 'text',
      required: true,
      layout: 'full',
    },
    {
      key: 'brokerageName',
      label: 'Brokerage Name',
      type: 'text',
      required: true,
      layout: 'half',
    },
    {
      key: 'brokerageLicenseNumber',
      label: 'Brokerage License Number',
      type: 'text',
      required: true,
      layout: 'half',
    },
    {
      key: 'brokerageStreet',
      label: 'Brokerage Street Address',
      type: 'text',
      required: true,
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
      required: true,
      layout: 'half',
    },
    {
      key: 'brokerageState',
      label: 'State',
      type: 'text',
      required: true,
      layout: 'quarter',
      placeholder: 'MO',
    },
    {
      key: 'brokerageZip',
      label: 'ZIP Code',
      type: 'text',
      required: true,
      layout: 'quarter',
      placeholder: '65801',
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
      validation: {
        email: true,
      },
      validationMessages: {
        email: 'Enter a valid email address.',
      },
    },
    {
      key: 'brokerageWebsiteUrl',
      label: 'Brokerage Website',
      type: 'text',
      layout: 'full',
      placeholder: 'https://example.com',
      validation: {
        pattern: websiteUrlPattern,
      },
      validationMessages: {
        pattern: 'Enter a valid website URL, including https://.',
      },
    },

    {
      key: 'headline',
      label: 'Headline',
      type: 'textarea',
      layout: 'full',
      helperText: 'This can appear on your public open house page.',
    },
    {
      key: 'primaryColor',
      label: 'Primary Color',
      type: 'text',
      layout: 'third',
      placeholder: '#111820',
      validation: { pattern: hexColorPattern },
      validationMessages: { pattern: 'Enter a valid HEX color.' },
      tooltip:
        'HEX codes represent colors using values like #B10F0F. If you do not know your brand colors, upload your logo or branding image to an AI assistant and ask it for your primary, secondary, and accent HEX color codes.',
    },
    {
      key: 'secondaryColor',
      label: 'Secondary Color',
      type: 'text',
      layout: 'third',
      placeholder: '#7F1D1D',
      validation: { pattern: hexColorPattern },
      validationMessages: { pattern: 'Enter a valid HEX color.' },
    },
    {
      key: 'accentColor',
      label: 'Accent Color',
      type: 'text',
      layout: 'third',
      placeholder: '#DC2626',
      validation: { pattern: hexColorPattern },
      validationMessages: { pattern: 'Enter a valid HEX color.' },
    },
  ],
};

export const SAVE_BUTTON_CONFIG: ButtonConfig = {
  variant: 'danger',
  label: 'Save',
};

export const RESET_BUTTON_CONFIG: ButtonConfig = {
  variant: 'secondary',
  label: 'Reset',
};
