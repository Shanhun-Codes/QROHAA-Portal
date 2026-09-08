import { Component, inject } from '@angular/core';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'aa-snackbar-host',
  standalone: true,
  imports: [],
  templateUrl: './snackbar-host.component.html',
  styleUrl: './snackbar-host.component.scss',
})
export class SnackbarHostComponent {
  readonly snackbarService = inject(SnackbarService);
}
