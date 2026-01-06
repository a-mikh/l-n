import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { NotFoundException } from '@nestjs/common';

describe('NotesService', () => {
  let service: NotesService;
  let repo: jest.Mocked<NotesRepository>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      searchByTag: jest.fn(),
    };

    service = new NotesService(repo);
  });

  it('returns note if found', async () => {
    const note = { id: 1, title: 'test', createdAt: '' };

    repo.findById.mockResolvedValue(note);

    const result = await service.findById(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(note);
  });

  it('throws NotFoundException if note not found', async () => {
    repo.findById.mockResolvedValue(undefined);

    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('creates note', async () => {
    const created = { id: 1, title: 'hello', createdAt: '' };

    repo.create.mockResolvedValue(created);

    const result = await service.create({ title: 'hello' });

    expect(repo.create).toHaveBeenCalledWith({ title: 'hello' });
    expect(result).toBe(created);
  });

  it('deletes note', async () => {
    const deleted = { id: 1, title: 'x', createdAt: '' };

    repo.delete.mockResolvedValue(deleted);

    const result = await service.delete(1);

    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toBe(deleted);
  });

  it('throws if delete target not found', async () => {
    repo.delete.mockResolvedValue(undefined);

    await expect(service.delete(1)).rejects.toThrow(NotFoundException);
  });
});
