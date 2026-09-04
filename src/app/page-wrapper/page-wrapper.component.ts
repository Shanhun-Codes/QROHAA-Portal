import { Component } from '@angular/core';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LeftHandNavComponent } from './components/left-hand-nav/left-hand-nav.component';

@Component({
  selector: 'aa-page-wrapper',
  standalone: true,
  imports: [TopBarComponent, LeftHandNavComponent],
  templateUrl: './page-wrapper.component.html',
  styleUrl: './page-wrapper.component.scss',
})
export class PageWrapperComponent {}
