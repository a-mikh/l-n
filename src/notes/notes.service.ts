import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Note } from './types/note.type';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { SearchNotesDto } from './dto/search-notes.dto';
import type { NotesRepository } from './notes.repository';
import { NOTES_REPOSITORY } from './tokens';

@Injectable()
export class NotesService {
  constructor(
    @Inject(NOTES_REPOSITORY) private readonly notesRepository: NotesRepository,
  ) {}

  async create(dto: CreateNoteDto): Promise<Note> {
    return this.notesRepository.create(dto);
  }

  async findAll(): Promise<Note[]> {
    return this.notesRepository.findAll();
  }

  async findById(id: number): Promise<Note> {
    const note = await this.notesRepository.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return note;
  }

  async update(id: number, dto: UpdateNoteDto): Promise<Note> {
    return await this.notesRepository.update(id, dto);
  }

  async delete(id: number): Promise<Note> {
    const note = await this.notesRepository.delete(id);
    return note;
  }

  async searchByTag(dto: SearchNotesDto): Promise<Note[]> {
    return this.notesRepository.searchByTag(dto.tag);
  }
}
