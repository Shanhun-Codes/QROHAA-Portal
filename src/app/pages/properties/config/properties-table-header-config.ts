import { ITableHeaderConfig } from '../../../shared/models/table.model';
import { Property } from '../models/property.model';

export const PROPERTY_TABLE_HEADER_CONFIG: ITableHeaderConfig<Property>[] = [
  {
    label: 'Street',
    value: 'street',
    type: 'text',
  },
  {
    label: 'City',
    value: 'city',
    type: 'text',
  },
  {
    label: 'State',
    value: 'state',
    type: 'text',
  },
  {
    label: 'Listing Price',
    value: 'listingPriceCents',
    type: 'text',
  },
  {
    label: 'Created',
    value: 'createdAt',
    type: 'text',
  },
  {
    label: 'Notes',
    type: 'icon',
    icon: 'note_stack',
  },
];
