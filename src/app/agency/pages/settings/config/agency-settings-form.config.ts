import { DynamicFormConfig } from '../../../../shared/components/dynamic-form/dynamic-form.model';
import {
  BRANDING_FORM_CONFIG,
  BROKERAGE_FORM_CONFIG,
} from '../../../../agent/pages/profile/config/agent-form.config';
import { AgencyBrokerage, AgencySettings } from '../agency-settings.model';
export function buildAgencySettingsForm(
  settings: AgencySettings,
  mode: 'BRANDING' | 'BROKERAGE',
): DynamicFormConfig {
  if (mode === 'BROKERAGE')
    return {
      ...BROKERAGE_FORM_CONFIG,
      fields: BROKERAGE_FORM_CONFIG.fields.map((field) => {
        const suffix = field.key.slice('brokerage'.length);
        const key = (suffix.charAt(0).toLowerCase() +
          suffix.slice(1)) as keyof AgencyBrokerage;
        return {
          ...field,
          value: settings.brokerage?.[key] ?? '',
          required: key === 'name' || key === 'licenseNumber',
        };
      }),
    };
  return {
    fields: [
      {
        key: 'name',
        label: 'Agency name',
        type: 'text',
        required: true,
        layout: 'full',
        value: settings.name,
        validation: { maxLength: 200 },
      },
      {
        key: 'headline',
        label: 'Agency headline',
        type: 'textarea',
        layout: 'full',
        value: settings.headline ?? '',
        validation: { maxLength: 500 },
      },
      ...BRANDING_FORM_CONFIG.fields.map((field) => ({
        ...field,
        value: settings[field.key as keyof AgencySettings] ?? '',
        validation: { pattern: '^#?(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$' },
        validationMessages: {
          pattern: 'Enter a HEX color, such as #144552.',
        },
      })),
    ],
  };
}
