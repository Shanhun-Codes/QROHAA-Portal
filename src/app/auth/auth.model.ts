export interface AgentProfile {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  realEstateLicenseNumber: string | null;
  headline: string | null;
  logoUrl: string | null;
  headshotUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  brandingLocked: boolean;
  agencyId: string | null;
  brokerage: Brokerage | null;
  createdAt: string;
  updatedAt: string;
}

export interface Brokerage {
  id: string;
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
  agentId: string | null;
  agencyId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AgentResponse =
  | { hasAgent: false }
  | { hasAgent: true; agent: AgentProfile };

export interface AgentUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  realEstateLicenseNumber?: string;
  headline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  brokerage?: {
    name?: string;
    licenseNumber?: string;
    phone?: string;
    email?: string;
    websiteUrl?: string;
    address?: {
      street?: string;
      street2?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
}

export interface Address {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}
