import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthenticatedRequest } from '../shared/types';
import { AuthGuardGraphQL } from '../auth/auth.guard.graphql';
import { Roles } from '../roles/roles.decorator';
import { USER_ROLE } from '../shared/const';

import { Book } from './book.entity';
import { BookService } from './book.service';
import { SuccessActionResponseDto } from './dto/success-action-response.dto';

@Resolver(() => Book)
export class BookResolver {
  readonly #bookService: BookService;

  constructor(bookService: BookService) {
    this.#bookService = bookService;
  }
  @Query(() => [Book])
  @UseGuards(AuthGuardGraphQL)
  @Roles(USER_ROLE.USER)
  async getBooks(): Promise<Book[]> {
    return this.#bookService.findAll();
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
    console.log("=>(book.resolver.ts:52) req.user", req.user);

    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return await this.#bookService.reserve(userId, bookId);
  }
}
