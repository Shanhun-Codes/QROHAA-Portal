import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'aa-leads',
  standalone: true,
  imports: [MatIcon, ButtonComponent],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent {
  readonly title = 'Leads';
  readonly subTitle = 'Manage and follow up with your open house leads here';
}
