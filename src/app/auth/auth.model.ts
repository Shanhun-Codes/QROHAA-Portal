export interface AgentProfile {
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  brokerageName?: string;
  headline?: string;
  logoUrl?: string;
  headshotUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgentResponse {
  hasAgent: boolean;
  agent: AgentProfile;
}
