import { ITableHeaderConfig } from '../../../shared/components/table/table.model';
import { Property, PropertyTableRow } from '../property.model';

export const PROPERTY_TABLE_HEADER_CONFIG: ITableHeaderConfig<PropertyTableRow>[] =
  [
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
      value: 'listingPrice',
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
