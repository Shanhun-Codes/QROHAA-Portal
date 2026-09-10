import { DynamicFormConfig } from '../../../shared/components/models/dynamic-form.model';

export const OPEN_HOUSE_FORM_CONFIG: DynamicFormConfig = {
  layout: {
    gap: 'md',
    labelPosition: 'top',
  },

  fields: [
    {
      key: 'startDate',
      label: 'Start Date',
      type: 'date',
      layout: 'half',
      required: true,
    },
    {
      key: 'startTime',
      label: 'Start Time',
      type: 'time',
      layout: 'half',
      required: true,
    },
    {
      key: 'durationDays',
      label: 'Duration',
      type: 'select',
      layout: 'half',
      required: true,
      value: 1,
      options: [
        { label: '1 Day', value: 1 },
        { label: '2 Days', value: 2 },
      ],
    },
    {
      key: 'endTime',
      label: 'End Time',
      type: 'time',
      layout: 'half',
      required: true,
    },
  ],
};
