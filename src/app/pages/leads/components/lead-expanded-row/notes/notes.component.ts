import { Component, computed, inject, input } from '@angular/core';
import { NotesService } from './notes.service';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { NOTE_BUTTON_CONFIG } from '../../../config/button.config';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { ActionMenuComponent } from '../../../../../shared/components/action-menu/action-menu.component';
import { Note } from '../../../models/note.model';
import { ActionMenuItem } from '../../../../../shared/components/models/action-menu.model';

@Component({
  selector: 'aa-notes',
  standalone: true,
  imports: [
    MatIcon,
    DatePipe,
    ButtonComponent,
    SpinnerComponent,
    ActionMenuComponent,
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  private readonly notesService = inject(NotesService);

  readonly addNoteButtonConfig = {
    ...NOTE_BUTTON_CONFIG,
    click: () => this.onAddNoteClick(),
  };

  public leadCreated = input.required<string>();

  readonly notes = computed(() => this.notesService.notes());
  readonly isNotesLoading = computed(() => this.notesService.isNotesLoading());

  onAddNoteClick(): void {
    this.notesService.openNoteDialog('CREATE');
  }

  getNoteActions(note: Note): ActionMenuItem[] {
    return [
      {
        label: 'Edit Note',
        icon: 'edit',
        action: () => this.onRowClick(note.id, note.body),
      },
      {
        label: 'Delete Note',
        icon: 'delete',
        danger: true,
        action: () => this.onDeleteNoteClick(note),
      },
    ];
  }

  onRowClick(noteId: string, noteBody: string): void {
    this.notesService.openNoteDialog('EDIT', noteId, noteBody);
  }

  onDeleteNoteClick(note: Note): void {
    console.log('DELETE NOTE:', note);
  }
}
