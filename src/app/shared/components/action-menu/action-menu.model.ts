export interface ActionMenuItem {
  label: string;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
  action: () => void;
}
