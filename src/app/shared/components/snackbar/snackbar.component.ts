import { Component, inject } from '@angular/core';
import { SnackbarService } from './snackbar.service';

@Component({
  selector: 'aa-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  readonly snackbarService = inject(SnackbarService);
}
