import { AgencyOption } from '../../models/agency.model';
export interface AgencyMember {
  id: string;
  email: string;
  role: string;
  status: string;
  agent: { firstName: string; lastName: string } | null;
}
export interface AgencyInvitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  redeemedAt: string | null;
  revokedAt: string | null;
}
export interface AgencyOverview {
  agency: AgencyOption;
  members: AgencyMember[];
  invitations: AgencyInvitation[];
  usedSeats: number;
  reservedSeats: number;
}
export interface InvitationResult {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  delivery: 'SENT' | 'MANUAL' | 'FAILED';
  link: string | null;
}
