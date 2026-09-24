import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { QrGeneratorComponent } from '../../../../shared/components/qr-generator/qr-generator.component';

import { environment } from '../../../../../environments/environment';

import { OpenHouseDetail } from '../../models/open-house.model';

import { OpenHouseExpandedRowService } from './open-house-expanded-row.service';
import { OpenHouseFlyerPreviewComponent } from '../open-house-flyer-preview/open-house-flyer-preview.component';
import { OpenHouseFormPreviewComponent } from '../open-house-form-preview/open-house-form-preview.component';
import {
  DOWNLOAD_FLYER_BUTTON_CONFIG,
  DOWNLOAD_PRINTABLE_FORM_BUTTON_CONFIG,
} from '../../config/button.config';
import { OpenHousesService } from '../../open-houses.service';
import { ActionMenuComponent } from '../../../../shared/components/action-menu/action-menu.component';
import { ActionMenuItem } from '../../../../shared/components/models/action-menu.model';
import { firstValueFrom } from 'rxjs';
import { formatPhoneNumber } from '../../../../shared/utils/format-phone-number.util';

@Component({
  selector: 'aa-open-house-expanded-row',
  imports: [
    DatePipe,
    ButtonComponent,
    QrGeneratorComponent,
    OpenHouseFlyerPreviewComponent,
    OpenHouseFormPreviewComponent,
    ActionMenuComponent,
  ],
  templateUrl: './open-house-expanded-row.component.html',
  styleUrl: './open-house-expanded-row.component.scss',
})
export class OpenHouseExpandedRowComponent {
  private readonly openHouseExpandedRowService = inject(
    OpenHouseExpandedRowService,
  );
  private readonly openHouseService = inject(OpenHousesService);

  readonly showSignPreview = signal(false);
  readonly showFormPreview = signal(false);

  toggleSignPreview(): void {
    this.showSignPreview.update((visible) => !visible);
  }

  toggleFormPreview(): void {
    this.showFormPreview.update((visible) => !visible);
  }
  readonly openHouseId = input.required<string>();

  readonly openHouse = signal<OpenHouseDetail | null>(null);

  readonly requiredQuestionCount = computed(
    () =>
      this.openHouse()?.openHouseFeedbackQuestions.filter(
        (question) => question.required,
      ).length ?? 0,
  );

  readonly printableQuestionCount = computed(
    () =>
      this.openHouse()?.openHouseFeedbackQuestions.filter(
        (question) => question.printable,
      ).length ?? 0,
  );

  readonly feedbackResponseCount = computed(
    () => this.openHouse()?.openHouseFeedbackSubmissions.length ?? 0,
  );

  readonly publicUrl = computed(() => {
    const openHouse = this.openHouse();

    if (!openHouse) {
      return '';
    }

    return `${environment.publicBaseUrl}/${openHouse.agent.slug}/open-house/${openHouse.publicCode}`;
  });

  readonly qrUrl = computed(() => {
    const publicUrl = this.publicUrl();

    if (!publicUrl) {
      return '';
    }

    return `${publicUrl}?source=qr`;
  });

  readonly downloadFlyerButtonConfig = {
    ...DOWNLOAD_FLYER_BUTTON_CONFIG,
    click: () => this.downloadFlyer(),
  };

  readonly downloadPrintableFormButtonConfig = {
    ...DOWNLOAD_PRINTABLE_FORM_BUTTON_CONFIG,
    click: () => this.downloadPrintableForm(),
  };

  constructor() {
    effect(() => {
      const openHouseId = this.openHouseId();

      this.loadOpenHouse(openHouseId);
    });
  }

  private loadOpenHouse(openHouseId: string): void {
    this.openHouseExpandedRowService.getOpenHouseDetail(openHouseId).subscribe({
      next: (openHouse) => {
        this.openHouse.set({
          ...openHouse,
          agent: {
            ...openHouse.agent,
            phone: formatPhoneNumber(openHouse.agent.phone),
          },
        });
      },

      error: (error) => {
        console.error('Failed to load open house details:', error);
        this.openHouse.set(null);
      },
    });
  }

  private downloadFlyer(): void {
    void this.openHouseService.downloadFlyer(this.openHouseId());
  }

  private downloadPrintableForm(): void {
    const openHouse = this.openHouse();

    if (!openHouse) {
      return;
    }

    this.openHouseService.downloadFeedbackForm(this.openHouseId());
  }

  getOpenHouseActions(openHouse: OpenHouseDetail): ActionMenuItem[] {
    return [
      {
        label: 'Edit Open House',
        icon: 'edit',
        action: () => this.onEditClick(openHouse.id),
      },
    ];
  }

  async onEditClick(openHouseId: string): Promise<void> {
    const openHouse = await firstValueFrom(
      this.openHouseExpandedRowService.getOpenHouseDetail(openHouseId),
    );

    await this.openHouseService.openOpenHouseDialog('EDIT', openHouse);

    this.loadOpenHouse(openHouseId);
  }
}
