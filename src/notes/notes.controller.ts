import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { type NoteDto } from './dto/note.dto';
import { Note } from './types/note.type';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @HttpCode(201)
  createNote(@Body() noteData: NoteDto) {
    const note: Note = {
      id: 0, // Temporary, will be set in service
      title: noteData.title,
      content: noteData.content,
      tags: noteData.tags,
      createdAt: new Date().toISOString(),
    };
    return this.notesService.create(note);
  }

  @Get()
  getAllNotes() {
    return this.notesService.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.findById(id);
  }

  @Patch(':id')
  updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedNote: Partial<Note>,
  ) {
    return this.notesService.update(id, updatedNote);
  }

  @Delete(':id')
  deleteNote(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.delete(id);
  }
}
