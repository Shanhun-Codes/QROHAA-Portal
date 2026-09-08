import { Component, input } from '@angular/core';
import { StatusPillConfig } from '../models/status-pill.model';

@Component({
  selector: 'aa-status-pill',
  standalone: true,
  imports: [],
  templateUrl: './status-pill.component.html',
  styleUrl: './status-pill.component.scss',
})
export class StatusPillComponent {
  public config = input.required<StatusPillConfig>();
}
