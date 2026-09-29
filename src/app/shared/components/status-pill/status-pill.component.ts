import { Component, input } from '@angular/core';
import { StatusPillConfig } from './status-pill.model';

@Component({
  selector: 'aa-status-pill',
  imports: [],
  templateUrl: './status-pill.component.html',
  styleUrl: './status-pill.component.scss',
})
export class StatusPillComponent {
  public config = input.required<StatusPillConfig>();
}
