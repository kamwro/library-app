import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Book } from './book.entity';
import { BookService } from './book.service';
import { CreateBookResponse } from './dto/success-action-response.dto';

@Resolver(() => Book)
export class BookResolver {
  readonly #bookService: BookService;

  constructor(bookService: BookService) {
    this.#bookService = bookService;
  }

  @Query(() => [Book])
  async getBooks(): Promise<Book[]> {
    return this.#bookService.findAll();
  }

  @Query(() => Book)
  async getBookById(@Args('id') id: string): Promise<Book | null> {
    return this.#bookService.findOneById(id);
  }

  @Mutation(() => CreateBookResponse)
  async addBook(
    @Args('title') title: string,
    @Args('author') author: string,
  ): Promise<CreateBookResponse> {
    return await this.#bookService.create(title, author);
  }
}
