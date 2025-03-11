import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SuccessActionResponseDto {
  @Field()
  message!: string;
}
