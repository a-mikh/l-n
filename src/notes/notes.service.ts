import { Injectable } from '@nestjs/common';
import { Note } from './types/note.type';

@Injectable()
export class NotesService {
  private notes: Note[] = [];
  private nextId: number = 1;

  create(note: Note): Note {
    note.id = this.nextId++;
    this.notes.push(note);
    return note;
  }

  findAll(): Note[] {
    return this.notes;
  }

  findById(id: number): Note | undefined {
    return this.notes.find((note) => note.id === id);
  }

  update(id: number, updatedNote: Partial<Note>): Note | null {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index !== -1) {
      this.notes[index] = { ...this.notes[index], ...updatedNote };
      return this.notes[index];
    }
    return null;
  }

  delete(id: number): Note | null {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index !== -1) {
      const deletedNote = this.notes.splice(index, 1);
      return deletedNote[0];
    }
    return null;
  }
}
