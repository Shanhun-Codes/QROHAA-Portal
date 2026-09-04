import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageWrapperComponent } from './page-wrapper/page-wrapper.component';

@Component({
  selector: 'aa-root',
  standalone: true,
  imports: [PageWrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'qrohaa-portal';
}
