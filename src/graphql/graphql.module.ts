import type { ApolloDriverConfig } from '@nestjs/apollo';
import { Request } from 'express';
import { ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }: { req: Request }) => ({ request: req }),
      playground: true, // TODO can be disabled later
    }),
  ],
})
export class GraphQLModule {}
