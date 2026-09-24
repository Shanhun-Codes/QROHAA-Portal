export type PropertyStatus = 'ACTIVE' | 'ARCHIVED';

export interface Property {
  id: string;
  street: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  listingPriceCents?: number | null;
  status: PropertyStatus;
  agentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormValue {
  street: string;
  street2?: string | null;
  city: string;
  state: string;
  zip: string;
  listingPrice?: number | string | null;
}

export interface PropertyTableRow extends Property {
  listingPrice: string;
}
