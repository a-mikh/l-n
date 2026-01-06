import type { Note } from './types/note.type';

export interface CreateNoteData {
  title: string;
  content?: string;
  tags?: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
}

export interface NotesRepository {
  create(this: void, note: CreateNoteData): Promise<Note>;
  findAll(this: void): Promise<Note[]>;
  findById(this: void, id: number): Promise<Note | undefined>;
  update(this: void, id: number, patch: UpdateNoteData): Promise<Note>;
  delete(this: void, id: number): Promise<Note>;
  searchByTag(this: void, tag: string): Promise<Note[]>;
}
