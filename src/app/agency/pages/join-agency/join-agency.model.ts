export interface InvitationPreview {
  email: string;
  signedInEmail: string;
  emailMatches: boolean;
  existingAccount: boolean;
  role: string;
  agency: {
    name: string;
    brokerage: { name: string; licenseNumber: string | null } | null;
  };
}
