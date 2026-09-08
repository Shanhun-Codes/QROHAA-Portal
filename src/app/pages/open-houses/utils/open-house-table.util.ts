import { DateTime } from 'luxon';

import { OpenHouse, OpenHouseTableRow } from '../models/open-house.model';
import { formatListingPrice } from '../../../shared/utils/format-listing-price.util';
import { StatusPillConfig } from '../../../shared/components/models/status-pill.model';

export function mapOpenHouseToTableRow(
  openHouse: OpenHouse,
): OpenHouseTableRow {
  const startsAt = DateTime.fromISO(openHouse.startsAt).toLocal();
  const endsAt = DateTime.fromISO(openHouse.endsAt).toLocal();
  const now = DateTime.local();

  let status: StatusPillConfig = {
    label: 'Upcoming',
    variant: 'info',
  };

  if (now > endsAt) {
    status = {
      label: 'Ended',
      variant: 'neutral',
    };
  } else if (now >= startsAt && now <= endsAt) {
    status = {
      label: 'Live',
      variant: 'success',
    };
  }

  return {
    ...openHouse,

    property: `${openHouse.property.street}${
      openHouse.property.street2 ? `,\n ${openHouse.property.street2},` : ''
    }\n${openHouse.property.city}, ${openHouse.property.state}`,

    listingPrice: formatListingPrice(openHouse.property.listingPriceCents),

    date: startsAt.toFormat('MMM d, yyyy'),

    time: `${startsAt.toFormat('h:mm a')} - ${endsAt.toFormat('h:mm a')}`,

    status,
  };
}
