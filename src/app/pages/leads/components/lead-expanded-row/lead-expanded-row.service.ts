import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AddNoteFormValue } from '../../models/note.model';
import { AddNoteDialogComponent } from '../../dialogs/add-note-dialog/add-note-dialog.component';
import { DialogService } from '../../../../shared/components/dialog/dialog.service';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '../../../../shared/components/snackbar/snackbar.service';
import { formatPhoneNumber } from '../../../../shared/utils/format-phone-number.util';

@Injectable({
  providedIn: 'root',
})
export class LeadExpandedRowService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = environment.agentId;
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);

  public leadDetails = signal<any>({});

  public getLead(leadId: string) {
    if (!this.agentId || !leadId) {
      return;
    }

    return this.http.get<any>(
      `${this.baseUrl}/agents/${this.agentId}/leads/${leadId}`,
    );
  }

  async createNote(note: string): Promise<boolean> {
    if (!note) {
      this.snackbarService.error('Note cannot be empty');
      return false;
    }

    const payload = {
      body: note,
    };

    try {
      await firstValueFrom(
        this.http.post<any>(
          `${this.baseUrl}/agents/${this.agentId}/leads/${this.leadDetails().id}/notes`,
          payload,
        ),
      );

      this.snackbarService.success('Note successfully created');

      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async openAddNoteDialog(): Promise<void> {
    this.dialogService.open({
      title: 'Note Details',
      contentComponent: AddNoteDialogComponent,
      data: {
        onSubmit: (note: string) => this.createNote(note),
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: 'Add Note',
          type: 'primary',
          submit: true,
        },
      ],
    });
  }
}
