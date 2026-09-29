export interface DynamicFormConfig<T extends object = any> {
  fields: DynamicFormField<T>[];

  layout?: {
    gap?: 'sm' | 'md' | 'lg';
    labelPosition?: 'top' | 'left';
  };
}

export interface DynamicFormField<T extends object> {
  key: Extract<keyof T, string>;
  label: string;
  type: DynamicFormFieldType;

  placeholder?: string;
  value?: unknown;
  required?: boolean;
  disabled?: boolean;

  layout?: 'full' | 'half' | 'third' | 'quarter';

  options?: DynamicFormOption[];
  validation?: DynamicFormValidation;
  validationMessages?: DynamicFormValidationMessages;
  selectPlaceholder?: string;
  helperText?: string;
  tooltip?: string;
  readonly?: boolean;
}

export interface DynamicFormOption {
  label: string;
  value: unknown;
}

export type DynamicFormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'time';

export interface DialogSubmittable {
  submit(): void;
}

export interface DynamicFormValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
}

export interface DynamicFormValidationMessages {
  required?: string;
  email?: string;
  minLength?: string;
  maxLength?: string;
  min?: string;
  max?: string;
  pattern?: string;
}
