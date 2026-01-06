import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateNoteData,
  NotesRepository,
  UpdateNoteData,
} from './notes.repository';
import type { Note } from './types/note.type';
import { mapPrismaNote } from './note.mapper';

@Injectable()
export class PrismaNotesRepository implements NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNoteData): Promise<Note> {
    const note = await this.prisma.note.create({ data });
    return mapPrismaNote(note);
  }

  async findAll(): Promise<Note[]> {
    const notes = await this.prisma.note.findMany({ orderBy: { id: 'desc' } });
    return notes.map((n) => mapPrismaNote(n));
  }

  async findById(id: number): Promise<Note | undefined> {
    const n = await this.prisma.note.findUnique({ where: { id } });
    return n ? mapPrismaNote(n) : undefined;
  }

  async update(id: number, patch: UpdateNoteData): Promise<Note> {
    const n = await this.prisma.note.update({ where: { id }, data: patch });
    return mapPrismaNote(n);
  }

  async delete(id: number): Promise<Note> {
    const n = await this.prisma.note.delete({ where: { id } });
    return mapPrismaNote(n);
  }

  async searchByTag(tag: string): Promise<Note[]> {
    const notes = await this.prisma.note.findMany({
      where: { tags: { has: tag } },
      orderBy: { id: 'desc' },
    });
    return notes.map((n) => mapPrismaNote(n));
  }
}
