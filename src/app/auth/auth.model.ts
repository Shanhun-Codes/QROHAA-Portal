export interface AgentProfile {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  realEstateLicenseNumber: string;
  brokerageName?: string;
  brokerage: Brokerage;
  headline?: string;
  logoUrl?: string;
  headshotUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  brandingLocked?: boolean;
  agencyId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brokerage {
  id?: string;
  name: string;
  licenseNumber: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  agencyId?: string | null;
}

export interface AgentResponse {
  hasAgent: boolean;
  agent: AgentProfile;
}

export interface Address {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}
