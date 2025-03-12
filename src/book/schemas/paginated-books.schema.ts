import { ObjectType, Field, Int } from '@nestjs/graphql';

import { Book } from '../book.entity';

@ObjectType()
export class PaginatedBooks {
  @Field(() => [Book])
  records!: Book[];

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalCount!: number;

  @Field(() => Int)
  totalPages!: number;
}