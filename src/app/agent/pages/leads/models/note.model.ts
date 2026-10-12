export interface Note {
  id: string;
  body: string;
  subjectType: string;
  subjectId: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  mentions?: [];
}

export interface AddNoteFormValue {
  note: string;
}

export interface NotesResponse {
  notes: Note[];
}

export type DialogType = 'CREATE' | 'EDIT';

export interface NoteDialogData {
  mode: DialogType;
  noteBody?: string;
  onSubmit: (note: string) => Promise<boolean>;
}
