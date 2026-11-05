import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export function timeLabel(value: string): string {
  const [hour, minute] = value.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

@Component({
  selector: 'aa-time-picker',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.scss',
})
export class TimePickerComponent implements ControlValueAccessor {
  readonly inputId = input.required<string>();
  readonly label = input('Time');
  readonly hours = Array.from({ length: 12 }, (_, i) => i + 1);
  readonly minutes = Array.from({ length: 60 }, (_, i) => i);
  readonly times = Array.from({ length: 96 }, (_, i) => {
    const value = `${String(Math.floor(i / 4)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}`;
    return { value, label: timeLabel(value) };
  });
  value = '';
  custom = false;
  disabled = false;
  hour = 12;
  minute = 0;
  period = 'PM';
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.custom =
      !!this.value && !this.times.some((t) => t.value === this.value);
    if (/^\d{2}:\d{2}$/.test(this.value)) {
      const [h, m] = this.value.split(':').map(Number);
      this.hour = h % 12 || 12;
      this.minute = m;
      this.period = h < 12 ? 'AM' : 'PM';
    }
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  selectTime(value: string): void {
    if (value === 'custom') {
      this.custom = true;
      this.updateCustom();
    } else {
      this.writeValue(value);
      this.onChange(value);
    }
  }
  updateCustom(): void {
    const h = (this.hour % 12) + (this.period === 'PM' ? 12 : 0);
    this.value = `${String(h).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
    this.onChange(this.value);
  }
}
