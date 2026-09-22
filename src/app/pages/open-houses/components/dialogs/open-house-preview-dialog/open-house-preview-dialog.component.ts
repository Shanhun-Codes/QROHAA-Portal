import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';

import { OpenHouse } from '../../../models/open-house.model';

import {
  CONFIRM_OPEN_HOUSE_BUTTON_CONFIG,
  EDIT_OPEN_HOUSE_BUTTON_CONFIG,
} from '../../../config/button.config';
import { QrGeneratorComponent } from '../../../../../shared/components/qr-generator/qr-generator.component';
import { AuthService } from '../../../../../auth/auth.service';
import { environment } from '../../../../../../environments/environment';

type OpenHousePreviewResult = 'EDIT' | 'CONFIRM';

@Component({
  selector: 'aa-open-house-preview-dialog',
  imports: [ButtonComponent, DatePipe, QrGeneratorComponent],
  templateUrl: './open-house-preview-dialog.component.html',
  styleUrl: './open-house-preview-dialog.component.scss',
})
export class OpenHousePreviewDialogComponent {
  private readonly authService = inject(AuthService);
  readonly publicBaseUrl = environment.publicBaseUrl;
  readonly data = input.required<{ openHouse: OpenHouse }>();
  readonly agentSlug = this.authService.agent()!.slug;

  readonly dialogRef = input.required<DialogRef<OpenHousePreviewResult>>();

  readonly editButtonConfig = {
    ...EDIT_OPEN_HOUSE_BUTTON_CONFIG,
    click: () => this.edit(),
  };

  readonly confirmButtonConfig = {
    ...CONFIRM_OPEN_HOUSE_BUTTON_CONFIG,
    click: () => this.confirm(),
  };

  edit(): void {
    this.dialogRef().close('EDIT');
  }

  confirm(): void {
    this.dialogRef().close('CONFIRM');
  }
}
