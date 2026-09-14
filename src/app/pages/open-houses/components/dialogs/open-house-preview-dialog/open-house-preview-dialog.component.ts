import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { DialogRef } from '../../../../../shared/components/dialog/dialog-ref';

import { OpenHouse } from '../../../models/open-house.model';

import {
  CONFIRM_OPEN_HOUSE_BUTTON_CONFIG,
  EDIT_OPEN_HOUSE_BUTTON_CONFIG,
} from '../../../config/button.config';

type OpenHousePreviewResult = 'EDIT' | 'CONFIRM';

@Component({
  selector: 'aa-open-house-preview-dialog',
  imports: [ButtonComponent, DatePipe],
  templateUrl: './open-house-preview-dialog.component.html',
  styleUrl: './open-house-preview-dialog.component.scss',
})
export class OpenHousePreviewDialogComponent {
  readonly data = input.required<{ openHouse: OpenHouse }>();

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
