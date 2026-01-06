import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NOTES_REPOSITORY } from './tokens';
import { PrismaNotesRepository } from './prisma-notes.repository';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    { provide: NOTES_REPOSITORY, useClass: PrismaNotesRepository },
  ],
})
export class NotesModule {}
