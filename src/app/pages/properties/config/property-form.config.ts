import { DynamicFormConfig } from '../../../shared/components/models/dynamic-form.model';

export const PROPERTY_FORM_CONFIG: DynamicFormConfig = {
  layout: {
    gap: 'md',
    labelPosition: 'top',
  },

  fields: [
    {
      key: 'street',
      label: 'Street Address',
      type: 'text',
      layout: 'full',
      required: true,
      placeholder: 'Enter street address',
      validation: {
        minLength: 2,
        maxLength: 100,
      },
    },

    {
      key: 'street2',
      label: 'Address Line 2',
      type: 'text',
      layout: 'full',
      placeholder: 'Apartment, suite, unit, etc.',
      validation: {
        maxLength: 100,
      },
    },

    {
      key: 'city',
      label: 'City',
      type: 'text',
      layout: 'half',
      required: true,
      placeholder: 'Enter city',
      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },

    {
      key: 'state',
      label: 'State',
      type: 'text',
      layout: 'quarter',
      required: true,
      placeholder: 'MO',
      validation: {
        minLength: 2,
        maxLength: 2,
      },
    },

    {
      key: 'zip',
      label: 'ZIP Code',
      type: 'text',
      layout: 'quarter',
      required: true,
      placeholder: '65804',
      validation: {
        minLength: 5,
        maxLength: 10,
      },
    },

    {
      key: 'listingPrice',
      label: 'Listing Price',
      type: 'text',
      layout: 'half',
      placeholder: 'Enter listing price',
      validation: {
        pattern: '^\\d+(\\.\\d{1,2})?$',
      },
    },
  ],
};

export const PROPERTY_SELECTION_FORM_CONFIG: DynamicFormConfig = {
  layout: {
    gap: 'md',
    labelPosition: 'top',
  },

  fields: [
    {
      key: 'propertyId',
      label: 'Property',
      type: 'select',
      layout: 'full',
      required: true,
      placeholder: 'Select a property',
      options: [
        {
          label: '1949 E Sunshine St, Springfield, MO',
          value: 'property-1',
        },
        {
          label: '310 N Jefferson Ave, Springfield, MO',
          value: 'property-2',
        },
        {
          label: '2201 S Campbell Ave, Springfield, MO',
          value: 'property-3',
        },
      ],
    },
  ],
};
