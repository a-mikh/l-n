import { PrismaNotesRepository } from './prisma-notes.repository';
import { PrismaService } from '../prisma/prisma.service';

describe('PrismaNotesRepository (integration)', () => {
  let prisma: PrismaService;
  let repo: PrismaNotesRepository;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    repo = new PrismaNotesRepository(prisma);
  });

  beforeEach(async () => {
    // clear the table before each test
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('create -> findById', async () => {
    const created = await repo.create({
      title: 'hello',
      content: 'world',
      tags: ['work', 'dev'],
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('hello');
    expect(created.createdAt).toBeDefined();

    const found = await repo.findById(created.id);
    expect(found).toBeDefined();
    expect(found!.title).toBe('hello');
    expect(found!.tags).toEqual(expect.arrayContaining(['work', 'dev']));
  });

  it('findById returns undefined if not found', async () => {
    const found = await repo.findById(999999);
    expect(found).toBeUndefined();
  });

  it('update updates mutable fields', async () => {
    const created = await repo.create({
      title: 't1',
      content: 'c1',
      tags: ['a'],
    });

    const updated = await repo.update(created.id, {
      title: 't2',
      tags: ['a', 'b'],
    });

    expect(updated).toBeDefined();
    expect(updated!.title).toBe('t2');
    expect(updated!.tags).toEqual(expect.arrayContaining(['a', 'b']));
  });

  it('update returns undefined if not found', async () => {
    const updated = await repo.update(123456, { title: 'x' });
    expect(updated).toBeUndefined();
  });

  it('delete removes record and returns deleted note', async () => {
    const created = await repo.create({
      title: 'to-delete',
      content: '',
      tags: [],
    });

    const deleted = await repo.delete(created.id);
    expect(deleted).toBeDefined();
    expect(deleted!.id).toBe(created.id);

    const found = await repo.findById(created.id);
    expect(found).toBeUndefined();
  });

  it('delete returns undefined if not found', async () => {
    const deleted = await repo.delete(123456);
    expect(deleted).toBeUndefined();
  });

  it('searchByTag finds notes by tag', async () => {
    await repo.create({ title: 'n1', content: '', tags: ['work'] });
    await repo.create({ title: 'n2', content: '', tags: ['home'] });
    await repo.create({ title: 'n3', content: '', tags: ['work', 'dev'] });

    const work = await repo.searchByTag('work');
    expect(work).toHaveLength(2);
    expect(work.map((n) => n.title)).toEqual(
      expect.arrayContaining(['n1', 'n3']),
    );
  });

  it('findAll returns all notes', async () => {
    await repo.create({ title: 'a', content: '', tags: [] });
    await repo.create({ title: 'b', content: '', tags: [] });

    const all = await repo.findAll();
    expect(all).toHaveLength(2);
  });
});
