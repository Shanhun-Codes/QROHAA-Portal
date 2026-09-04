import { Component } from '@angular/core';
import { LEFT_HAND_NAV_CONFIG } from './left-hand-nav.config';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'aa-left-hand-nav',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './left-hand-nav.component.html',
  styleUrl: './left-hand-nav.component.scss',
})
export class LeftHandNavComponent {
  readonly navConfig = LEFT_HAND_NAV_CONFIG;
}
