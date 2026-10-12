export interface AgencyBrokerage {
  name: string;
  licenseNumber: string | null;
  phone: string | null;
  email: string | null;
  websiteUrl: string | null;
  street: string | null;
  street2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}
export interface AgencySettings {
  id: string;
  name: string;
  headline: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  brokerage: AgencyBrokerage | null;
}
export interface AgencySettingsUpdate {
  name?: string;
  headline?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  brokerage?: {
    name: string;
    licenseNumber: string | null;
    phone: string | null;
    email: string | null;
    websiteUrl: string | null;
    address: {
      street: string | null;
      street2: string | null;
      city: string | null;
      state: string | null;
      zip: string | null;
    };
  };
}
