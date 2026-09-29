export type StatusPillVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'neutral';

export interface StatusPillConfig {
  label: string;
  variant: StatusPillVariant;
}
