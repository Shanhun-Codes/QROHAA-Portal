import { propertyAddress } from './property-address.util';

describe('property address normalization', () => {
  const components = [
    { types: ['street_number'], long_name: '123', short_name: '123' },
    { types: ['route'], long_name: 'Main Street', short_name: 'Main St' },
    {
      types: ['locality'],
      long_name: 'Springfield',
      short_name: 'Springfield',
    },
    {
      types: ['administrative_area_level_1'],
      long_name: 'Missouri',
      short_name: 'MO',
    },
    { types: ['postal_code'], long_name: '65801', short_name: '65801' },
    { types: ['country'], long_name: 'United States', short_name: 'US' },
  ];
  it('uses provider capitalization and structured fields without blanking an existing unit', () => {
    expect(propertyAddress(components)).toEqual({
      street: '123 Main Street',
      city: 'Springfield',
      state: 'MO',
      zip: '65801',
    });
  });
  it('includes an explicitly selected unit and ZIP extension', () => {
    expect(
      propertyAddress([
        ...components,
        { types: ['subpremise'], long_name: '4B', short_name: '4B' },
        {
          types: ['postal_code_suffix'],
          long_name: '1234',
          short_name: '1234',
        },
      ]),
    ).toEqual({
      street: '123 Main Street',
      street2: '4B',
      city: 'Springfield',
      state: 'MO',
      zip: '65801-1234',
    });
  });
  it('rejects incomplete suggestions without overwriting the manual form', () => {
    expect(propertyAddress([])).toBeNull();
    expect(
      propertyAddress(
        components.filter((c) => !c.types.includes('street_number')),
      ),
    ).toBeNull();
  });
});
