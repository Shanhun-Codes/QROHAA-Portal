export interface ITableHeaderConfig<T> {
  label: string;
  value?: keyof T;
  type?: string;
  icon?: string;
  className?: string;
}
