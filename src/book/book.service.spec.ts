import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockDate = new Date();

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;
  let findSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;
  let insertMock: jest.SpyInstance;

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn().mockResolvedValue([]), // Mock find() to return an empty array
      findOne: jest.fn().mockImplementation(({ where: { id } }): Book | null =>
        id === 'existing-id'
          ? {
              id: 'existing-id',
              title: 'Book Title',
              author: 'Author',
              isAvailable: true,
              createdAt: mockDate,
              updatedAt: null,
            }
          : null,
      ),
      insert: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository, // Provide the mock repository
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));

    findSpy = jest.spyOn(bookRepository, 'find');
    findOneSpy = jest.spyOn(bookRepository, 'findOne');
    insertMock = jest.spyOn(bookRepository, 'insert');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array when no books are found', async () => {
    await expect(service.findAll()).resolves.toEqual([]);
    expect(findSpy).toHaveBeenCalled();
  });

  it('should return a book by ID if it exists', async () => {
    const book = await service.findOneById('existing-id');
    expect(book).toEqual({
      id: 'existing-id',
      title: 'Book Title',
      author: 'Author',
      updatedAt: null,
      createdAt: mockDate,
      isAvailable: true,
    });
    expect(findOneSpy).toHaveBeenCalled();
  });

  it('should return null if book does not exist', () => {
    expect(service.findOneById('non-existing-id')).toBeNull();
    expect(findOneSpy).toHaveBeenCalled();
  });

  it('should insert a book and return success message', async () => {
    const title = 'New Book';
    const author = 'New Author';

    expect(await service.create(title, author)).toEqual({
      message: 'Book created successfully!',
    });

    expect(insertMock).toHaveBeenCalledWith({
      title,
      author,
      isAvailable: true,
      updatedAt: null,
    });
  });
});
