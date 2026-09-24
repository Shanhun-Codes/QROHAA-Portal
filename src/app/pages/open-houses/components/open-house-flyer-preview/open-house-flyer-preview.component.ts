import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { QrGeneratorComponent } from '../../../../shared/components/qr-generator/qr-generator.component';

import { OpenHouseDetail } from '../../models/open-house.model';

@Component({
  selector: 'aa-open-house-flyer-preview',
  imports: [DatePipe, QrGeneratorComponent],
  templateUrl: './open-house-flyer-preview.component.html',
  styleUrl: './open-house-flyer-preview.component.scss',
})
export class OpenHouseFlyerPreviewComponent {
  readonly openHouse = input.required<OpenHouseDetail>();

  readonly publicUrl = input.required<string>();

  readonly qrUrl = computed(() => `${this.publicUrl()}?source=qr`);

  readonly agentName = computed(
    () =>
      `${this.openHouse().agent.firstName} ${this.openHouse().agent.lastName}`,
  );
}
