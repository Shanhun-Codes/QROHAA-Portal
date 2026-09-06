import { DateTime } from 'luxon';

export function formatDateTime(
  value: string,
  format = 'MMM d, yyyy h:mm a ZZZZ',
): string {
  if (!value) {
    return '';
  }

  return DateTime.fromISO(value, { zone: 'utc' }).toLocal().toFormat(format);
}
