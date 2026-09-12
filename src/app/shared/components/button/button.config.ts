export interface ButtonConfig {
  label?: string;
  icon?: string;
  variant?: TVariant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  click?: () => void;
}

export type TVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
