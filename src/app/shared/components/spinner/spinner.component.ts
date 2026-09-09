import { Component, input } from '@angular/core';

@Component({
  selector: 'aa-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  readonly size = input<number>(32);
  readonly color = input<string>('#b10f0f');
  readonly trackColor = input<string>('rgba(255, 255, 255, 0.12)');
}
