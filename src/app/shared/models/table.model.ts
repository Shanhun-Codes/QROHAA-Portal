export interface ITableHeaderConfig<T> {
  label: string;
  value?: keyof T;
  type?: 'text' | 'icon' | 'actions' | 'pill';
  icon?: string;
}
