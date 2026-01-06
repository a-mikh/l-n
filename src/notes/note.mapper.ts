import type { Note as PrismaNote } from '@prisma/client';
import type { Note } from './types/note.type';

export function mapPrismaNote(n: PrismaNote): Note {
  return {
    id: n.id,
    title: n.title,
    content: n.content ?? undefined,
    tags: n.tags,
    createdAt: n.createdAt.toISOString(),
  };
}
