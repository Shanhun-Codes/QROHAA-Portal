import { Component } from '@angular/core';
import { PageTemplateComponent } from '../../page-wrapper/page-template/page-template.component';
import { OPEN_HOUSE_BUTTON_CONFIG } from './config/button.config';

@Component({
  selector: 'aa-open-houses',
  standalone: true,
  imports: [PageTemplateComponent],
  templateUrl: './open-houses.component.html',
  styleUrl: './open-houses.component.scss',
})
export class OpenHousesComponent {
  readonly title = 'Open Houses';
  readonly subtitle = 'Manage your open houses here';
  readonly buttonConfig = OPEN_HOUSE_BUTTON_CONFIG;
}
