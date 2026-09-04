import { Component } from '@angular/core';
import { TopBarComponent } from './components/top-bar/top-bar.component';

@Component({
  selector: 'aa-page-wrapper',
  standalone: true,
  imports: [TopBarComponent],
  templateUrl: './page-wrapper.component.html',
  styleUrl: './page-wrapper.component.scss',
})
export class PageWrapperComponent {}
