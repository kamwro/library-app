import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ReservationLogService } from '../reservation-log/reservation-log.service';
import { User } from '../user/user.entity';

import { Book } from './book.entity';
import type { SuccessActionResponseDto } from './dto/success-action-response.dto';
import type { FindAllBooksProps } from './book.types';
import type { PaginatedBooks } from './schemas/paginated-books.schema';

@Injectable()
export class BookService {
  readonly #bookRepository: Repository<Book>;
  readonly #userRepository: Repository<User>;
  readonly #reservationLogService: ReservationLogService;

  constructor(
    @InjectRepository(Book) bookRepository: Repository<Book>,
    @InjectRepository(User) userRepository: Repository<User>,
    reservationLogService: ReservationLogService,
  ) {
    this.#bookRepository = bookRepository;
    this.#userRepository = userRepository;
    this.#reservationLogService = reservationLogService;
  }

  async findAll({
    search = '',
    page = 1,
    sortBy = 'title',
    sortOrder = 'DESC',
    limit = 10,
  }: FindAllBooksProps): Promise<PaginatedBooks> {
    const [records, totalCount] = await this.#bookRepository.findAndCount({
      where: [{ title: Like(`%${search}%`) }, { author: Like(`%${search}%`) }],
      take: limit,
      skip: (page - 1) * limit,
      order: {
        [sortBy]: sortOrder,
      },
      relations: ['reservedBy'],
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      records,
      currentPage: page,
      totalCount,
      totalPages,
    };
  }

  findOneById(id: string): Promise<Book | null> {
    return this.#bookRepository.findOne({ where: { id }, relations: ['reservedBy'] });
  }

  async create(title: string, author: string): Promise<SuccessActionResponseDto> {
    await this.#bookRepository.insert({ title, author, isAvailable: true, updatedAt: null });
    return { message: 'Book created successfully!' };
  }

  async reserve(userId: string, bookId: string): Promise<SuccessActionResponseDto> {
    const [user, book] = await Promise.all([
      this.#userRepository.findOne({
        where: { id: userId },
        relations: ['reservations'],
      }),
      this.#bookRepository.findOne({ where: { id: bookId } }),
    ]);

    if (!user) throw new NotFoundException('User not found');
    if (!book) throw new NotFoundException('Book not found');

    if (!book.isAvailable) {
      return { message: `Book is already reserved since ${book.reservedAt?.toISOString()}` };
    }

    Object.assign(book, {
      isAvailable: false,
      reservedAt: new Date(),
      reservedBy: user,
    });

    user.reservations.push(book);

    await Promise.all([this.#bookRepository.save(book), this.#userRepository.save(user)]);

    await this.#reservationLogService.createLog(userId, bookId, 'reserve');

    return { message: 'Book reserved successfully' };
  }
}
