export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
export function propertyAddress(
  components: AddressComponent[],
): Record<string, string> | null {
  const get = (type: string, short = false) => {
    const c = components.find((c) => c.types.includes(type));
    return c ? (short ? c.short_name : c.long_name) : '';
  };
  const number = get('street_number'),
    route = get('route');
  const city =
    get('locality') || get('postal_town') || get('sublocality_level_1');
  const state = get('administrative_area_level_1', true),
    zip = get('postal_code');
  if (
    !number ||
    !route ||
    !city ||
    !state ||
    !zip ||
    get('country', true) !== 'US'
  )
    return null;
  const result: Record<string, string> = {
    street: `${number} ${route}`,
    city,
    state,
    zip:
      zip + (get('postal_code_suffix') ? `-${get('postal_code_suffix')}` : ''),
  };
  if (get('subpremise')) result['street2'] = get('subpremise');
  return result;
}
