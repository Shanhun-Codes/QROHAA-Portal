import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

@Component({
  selector: 'aa-select',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent<T = string> {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly options = input.required<SelectOption<T>[]>();
  readonly placeholder = input<string>('Select');
  readonly value = input<T | null>(null);

  readonly valueChange = output<T>();

  readonly isOpen = signal(false);

  toggle(): void {
    this.isOpen.update((value) => !value);
  }

  close(): void {
    this.isOpen.set(false);
  }

  selectOption(option: SelectOption<T>): void {
    this.valueChange.emit(option.value);
    this.close();
  }

  getSelectedLabel(): string {
    const selected = this.options().find(
      (option) => option.value === this.value(),
    );

    return selected?.label ?? this.placeholder();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
