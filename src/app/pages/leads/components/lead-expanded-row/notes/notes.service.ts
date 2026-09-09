import { inject, Injectable, signal } from '@angular/core';
import { Note, DialogType } from '../../../models/note.model';
import { DialogService } from '../../../../../shared/components/dialog/dialog.service';
import { SnackbarService } from '../../../../../shared/components/snackbar/snackbar.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { NoteDialogComponent } from '../../../dialogs/note-dialog/note-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly dialogService = inject(DialogService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly agentId = environment.agentId;

  public isNotesLoading = signal<boolean>(false);
  public leadId = signal<string>('');
  public notes = signal<Note[] | null>(null);

  async getNotes() {
    if (!this.agentId || !this.leadId()) {
      console.log('AgentId LeadId error');
      return;
    }

    try {
      this.isNotesLoading.set(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await firstValueFrom(
        this.http.get<Note[]>(
          `${this.baseUrl}/agents/${this.agentId}/leads/${this.leadId()}/notes`,
        ),
      );

      this.notes.set(response);
      console.log('Notes sucessfully received');

      console.log(this.notes());
      this.isNotesLoading.set(false);
      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
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
      this.isNotesLoading.set(true);

      const response = await firstValueFrom(
        this.http.post<Note[]>(
          `${this.baseUrl}/agents/${this.agentId}/leads/${this.leadId()}/notes`,
          payload,
        ),
      );

      this.snackbarService.success('Note successfully created');
      this.notes.set(response);
      console.log('NOTES AFTER UPDATE: ', this.notes());

      this.isNotesLoading.set(false);
      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async editNote(noteId: string, note: string): Promise<boolean> {
    if (!note) {
      this.snackbarService.error('Note cannot be empty');
      return false;
    }

    const payload = {
      body: note,
    };

    try {
      this.isNotesLoading.set(true);

      const response = await firstValueFrom(
        this.http.patch<Note[]>(
          `${this.baseUrl}/agents/${this.agentId}/leads/${this.leadId()}/notes/${noteId}`,
          payload,
        ),
      );

      this.snackbarService.success('Note successfully updated');
      this.notes.set(response);
      console.log('NOTES AFTER UPDATE: ', this.notes());

      this.isNotesLoading.set(false);
      return true;
    } catch {
      this.snackbarService.error('An error occurred, please try again');

      return false;
    }
  }

  async openNoteDialog(
    mode: DialogType,
    noteId?: string,
    noteBody?: string,
  ): Promise<void> {
    this.dialogService.open({
      title: mode === 'ADD' ? 'Add Note' : 'Update',
      contentComponent: NoteDialogComponent,
      data: {
        mode,
        noteBody,
        onSubmit:
          mode === 'ADD'
            ? (note: string) => this.createNote(note)
            : (note: string) => this.editNote(noteId!, note),
      },
      actions: [
        {
          label: 'Cancel',
          type: 'secondary',
        },
        {
          label: mode === 'ADD' ? 'Add Note' : 'Edit Note',
          type: 'primary',
          submit: true,
        },
      ],
    });
  }
}
