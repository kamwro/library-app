import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Roles } from '../roles/roles.decorator';
import { USER_ROLE } from '../shared/const';

import { Book } from './book.entity';
import { BookService } from './book.service';
import { SuccessActionResponseDto } from './dto/success-action-response.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuardRest } from '../auth/auth.guard.rest';

@Resolver(() => Book)
export class BookResolver {
  readonly #bookService: BookService;

  constructor(bookService: BookService) {
    this.#bookService = bookService;
  }

  @UseGuards(AuthGuardRest)
  @Roles(USER_ROLE.USER)
  @Query(() => [Book])
  async getBooks(): Promise<Book[]> {
    return this.#bookService.findAll();
  }

  @Roles(USER_ROLE.USER)
  @Query(() => Book)
  async getBookById(@Args('id') id: string): Promise<Book | null> {
    return this.#bookService.findOneById(id);
  }

  @Roles(USER_ROLE.ADMIN)
  @Mutation(() => SuccessActionResponseDto)
  async addBook(
    @Args('title') title: string,
    @Args('author') author: string,
  ): Promise<SuccessActionResponseDto> {
    return await this.#bookService.create(title, author);
  }
}
