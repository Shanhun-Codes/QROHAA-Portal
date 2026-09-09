import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { NotesService } from './notes.service';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { NOTE_BUTTON_CONFIG } from '../../../config/button.config';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'aa-notes',
  standalone: true,
  imports: [MatIcon, DatePipe, ButtonComponent, SpinnerComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent implements OnInit, AfterViewInit {
  private readonly notesService = inject(NotesService);

  readonly addNoteButtonConfig = {
    ...NOTE_BUTTON_CONFIG,
    click: () => this.onAddNoteClick(),
  };

  public leadCreated = input.required<string>();
  public _leadId = input.required<string>();
  readonly notes = computed(() => this.notesService.notes());
  readonly isNotesLoading = computed(() => this.notesService.isNotesLoading());

  ngOnInit(): void {
    console.log(this._leadId());
  }
  ngAfterViewInit(): void {
    this.notesService.leadId.set(this._leadId());
    this.notesService.getNotes();
    console.log('LEAD ID:', this._leadId());
    console.log('NOTES', this.notes());
  }

  onAddNoteClick(): void {
    this.notesService.openNoteDialog('ADD');
  }

  onRowClick(noteId: string, noteBody: string): void {
    console.log('CLICKED FROM COMPONENT', noteId);
    this.notesService.openNoteDialog('EDIT', noteId, noteBody);
  }
}
