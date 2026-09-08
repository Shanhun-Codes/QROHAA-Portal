import { Component, computed, effect, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogRef } from '../dialog/dialog-ref';
import { DynamicFormConfig } from '../models/dynamic-form.model';

@Component({
  selector: 'aa-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  readonly config = input.required<DynamicFormConfig>();
  readonly dialogRef = input<DialogRef<any>>();
  readonly formSubmit = output<unknown>();

  readonly form = computed(() => this.buildForm(this.config()));

  constructor() {
    effect(() => {
      const dialogRef = this.dialogRef();

      if (dialogRef) {
        dialogRef.registerSubmitHandler(() => this.submit());
      }
    });
  }

  submit(): void {
    const form = this.form();

    form.markAllAsTouched();

    if (form.invalid) {
      return;
    }

    const values = form.getRawValue();

    this.formSubmit.emit(values);
  }

  private buildForm(config: DynamicFormConfig): FormGroup {
    const controls: Record<string, FormControl> = {};

    for (const field of config.fields) {
      const validators = [];

      if (field.required) {
        validators.push(
          field.type === 'checkbox'
            ? Validators.requiredTrue
            : Validators.required,
        );
      }
      if (field.validation?.email) {
        validators.push(Validators.email);
      }

      if (field.validation?.minLength !== undefined) {
        validators.push(Validators.minLength(field.validation.minLength));
      }

      if (field.validation?.maxLength !== undefined) {
        validators.push(Validators.maxLength(field.validation.maxLength));
      }

      if (field.validation?.min !== undefined) {
        validators.push(Validators.min(field.validation.min));
      }

      if (field.validation?.max !== undefined) {
        validators.push(Validators.max(field.validation.max));
      }

      if (field.validation?.pattern) {
        validators.push(Validators.pattern(field.validation.pattern));
      }

      const control = new FormControl(
        field.value ?? (field.type === 'checkbox' ? false : ''),
        {
          validators,
        },
      );

      if (field.disabled) {
        control.disable();
      }

      controls[field.key] = control;
    }

    return new FormGroup(controls);
  }
}
