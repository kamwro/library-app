import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthenticatedRequest } from '../shared/types';
import { AuthGuardGraphQL } from '../auth/auth.guard.graphql';
import { Roles } from '../roles/roles.decorator';
import { USER_ROLE } from '../shared/const';

import { Book } from './book.entity';
import { BookService } from './book.service';
import { SuccessActionResponseDto } from './dto/success-action-response.dto';
import { PaginatedBooks } from './schemas/paginated-books.schema';

@Resolver(() => Book)
export class BookResolver {
  readonly #bookService: BookService;

  constructor(bookService: BookService) {
    this.#bookService = bookService;
  }
  @Query(() => PaginatedBooks)
  @UseGuards(AuthGuardGraphQL)
  @Roles(USER_ROLE.USER)
  async getBooks(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('sortBy', { type: () => String, nullable: true, defaultValue: 'title' }) sortBy?: string,
    @Args('sortOrder', { type: () => String, nullable: true, defaultValue: 'ASC' })
    sortOrder?: 'ASC' | 'DESC',
  ): Promise<PaginatedBooks> {
    return await this.#bookService.findAll({ page, limit, search, sortBy, sortOrder });
  }

  @Query(() => Book)
  @UseGuards(AuthGuardGraphQL)
  @Roles(USER_ROLE.USER)
  async getBookById(@Args('id') id: string): Promise<Book | null> {
    return this.#bookService.findOneById(id);
  }

  @Mutation(() => SuccessActionResponseDto)
  @UseGuards(AuthGuardGraphQL)
  @Roles(USER_ROLE.ADMIN)
  async addBook(
    @Args('title') title: string,
    @Args('author') author: string,
  ): Promise<SuccessActionResponseDto> {
    return await this.#bookService.create(title, author);
  }

  @Mutation(() => SuccessActionResponseDto)
  @UseGuards(AuthGuardGraphQL)
  @Roles(USER_ROLE.USER)
  async reserveBook(
    @Args('bookId') bookId: string,
    @Context('req') req: AuthenticatedRequest,
  ): Promise<SuccessActionResponseDto> {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return await this.#bookService.reserve(userId, bookId);
  }
}
