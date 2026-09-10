export interface Property {
  id: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  listingPriceCents: number;
  openHouses: [];
  createdAt: string;
}

export interface PropertyTableRow extends Property {
  listingPrice: string;
}

export interface PropertyFormValue {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  listingPrice: number;
}
