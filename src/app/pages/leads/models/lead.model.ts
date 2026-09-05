export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
}

export enum LeadStatusType {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  FOLLOW_UP = 'FOLLOW_UP',
  QUALIFIED = 'QUALIFIED',
  CLOSED = 'CLOSED',
  LOST = 'LOST',
}
