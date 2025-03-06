import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateBookResponse {
  @Field()
  message!: string;
}