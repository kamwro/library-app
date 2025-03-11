import type { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Book } from './book.entity';
import type { SuccessActionResponseDto } from './dto/success-action-response.dto';

@Injectable()
export class BookService {
  readonly #bookRepository: Repository<Book>;

  constructor(@InjectRepository(Book) bookRepository: Repository<Book>) {
    this.#bookRepository = bookRepository;
  }

  findAll(): Promise<Book[]> {
    return this.#bookRepository.find();
  }

  findOneById(id: string): Promise<Book | null> {
    return this.#bookRepository.findOne({ where: { id } });
  }

  async create(title: string, author: string): Promise<SuccessActionResponseDto> {
    await this.#bookRepository.insert({ title, author, isAvailable: true, updatedAt: null });
    return { message: 'Book created successfully!' };
  }
}
