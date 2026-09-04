import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'aa-top-bar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  readonly title = 'Open House Studio';
  readonly activePortal = 'Agent App';
  readonly userName = 'Michael Elder';
  readonly userEmail = 'michael.edler@kw.com';
  readonly userAvatarUrl = 'michael-elder-headshot.PNG';

  readonly subtitle = this.activePortal;
}
