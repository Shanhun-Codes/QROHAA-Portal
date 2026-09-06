export function formatListingPrice(
  listingPriceCents: number | null | undefined,
): string {
  if (listingPriceCents == null) {
    return '';
  }

  return (listingPriceCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}
