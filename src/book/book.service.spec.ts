import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { Book } from './book.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockDate = new Date();

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;
  let findOneBookSpy: jest.SpyInstance;
  let insertBookSpy: jest.SpyInstance;
  let findBookAndCountSpy: jest.SpyInstance;

  let userRepository: Repository<User>;

  beforeEach(async () => {
    const mockBookRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest
        .fn()
        .mockImplementation(({ where: { id } }): Omit<Book, 'reservedBy' | 'reservedAt'> | null =>
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
      save: jest.fn().mockResolvedValue(undefined),
      findAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    findOneBookSpy = jest.spyOn(bookRepository, 'findOne');
    insertBookSpy = jest.spyOn(bookRepository, 'insert');
    findBookAndCountSpy = jest.spyOn(bookRepository, 'findAndCount');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an empty array when no books are found', async () => {
    findBookAndCountSpy.mockResolvedValue([[], 0]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.records).toEqual([]);
    expect(result.totalCount).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(findBookAndCountSpy).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: expect.any(Array),
      take: 10,
      skip: 0,
      order: { title: 'DESC' },
      relations: ['reservedBy'],
    });
  });

  it('should return books when results are found', async () => {
    const mockBooks = [{ title: 'Test Book', author: 'Author' }];
    findBookAndCountSpy.mockResolvedValue([mockBooks, 1]);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.records).toEqual(mockBooks);
    expect(result.totalCount).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(findBookAndCountSpy).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: expect.any(Array),
      take: 10,
      skip: 0,
      order: { title: 'DESC' },
      relations: ['reservedBy'],
    });
  });

  it('should apply pagination correctly', async () => {
    // Arrange: Mock the repository's findAndCount method to return books with pagination
    const mockBooks = [
      { title: 'Test Book 1', author: 'Author 1' },
      { title: 'Test Book 2', author: 'Author 2' },
    ];
    findBookAndCountSpy.mockResolvedValue([mockBooks, 20]);

    const result = await service.findAll({ page: 2, limit: 5 });

    expect(result.records).toEqual(mockBooks);
    expect(result.totalCount).toBe(20);
    expect(result.totalPages).toBe(4);
    expect(findBookAndCountSpy).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: expect.any(Array),
      take: 5,
      skip: 5,
      order: { title: 'DESC' },
      relations: ['reservedBy'],
    });
  });

  it('should apply search filter correctly', async () => {
    const mockBooks = [{ title: 'Harry Potter', author: 'J.K. Rowling' }];
    findBookAndCountSpy.mockResolvedValue([mockBooks, 1]);

    const result = await service.findAll({ page: 1, limit: 10, search: 'Harry' });

    expect(result.records).toEqual(mockBooks);
    expect(result.totalCount).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(findBookAndCountSpy).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: expect.any(Array),
      take: 10,
      skip: 0,
      order: { title: 'DESC' },
      relations: ['reservedBy'],
    });
  });

  it('should apply sorting correctly', async () => {
    const mockBooks = [
      { title: 'Z Book', author: 'Author Z' },
      { title: 'A Book', author: 'Author A' },
    ];

    findBookAndCountSpy.mockResolvedValue([
      mockBooks.sort((a, b) => a.author.localeCompare(b.author)),
      2,
    ]);

    const result = await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'author',
      sortOrder: 'ASC',
    });

    expect(result.records).toEqual([
      { title: 'A Book', author: 'Author A' },
      { title: 'Z Book', author: 'Author Z' },
    ]);

    expect(result.totalCount).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(findBookAndCountSpy).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: expect.any(Array),
      take: 10,
      skip: 0,
      order: { author: 'ASC' },
      relations: ['reservedBy'],
    });
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
    expect(findOneBookSpy).toHaveBeenCalled();
  });

  it('should return null if book does not exist', () => {
    expect(service.findOneById('non-existing-id')).toBeNull();
    expect(findOneBookSpy).toHaveBeenCalled();
  });

  it('should insert a book and return success message', async () => {
    const title = 'New Book';
    const author = 'New Author';

    expect(await service.create(title, author)).toEqual({
      message: 'Book created successfully!',
    });

    expect(insertBookSpy).toHaveBeenCalledWith({
      title,
      author,
      isAvailable: true,
      updatedAt: null,
    });
  });
  describe('reserve', () => {
    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(new Book());

      await expect(service.reserve('invalidUserId', 'bookId')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if book is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User());
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(null);

      await expect(service.reserve('userId', 'invalidBookId')).rejects.toThrow(NotFoundException);
    });

    it('should return a message if the book is already reserved', async () => {
      const book = new Book();
      book.isAvailable = false;
      book.reservedAt = new Date();

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User());
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);

      const result = await service.reserve('userId', 'bookId');
      expect(result.message).toContain('Book is already reserved');
    });

    it('should successfully reserve a book', async () => {
      const user = new User();
      user.reservations = [];

      const book = new Book();
      book.isAvailable = true;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValue(book);
      jest.spyOn(bookRepository, 'save').mockResolvedValue(book);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await service.reserve('userId', 'bookId');

      expect(book.isAvailable).toBe(false);
      expect(user.reservations).toContain(book);
      expect(result.message).toBe('Book reserved successfully');

      expect(bookRepository['save']).toHaveBeenCalledWith(book);
      expect(userRepository['save']).toHaveBeenCalledWith(user);
    });
  });
});
