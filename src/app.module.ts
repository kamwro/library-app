import { Module } from '@nestjs/common';

import { BookModule } from './book/book.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from './graphql/graphql.module';

@Module({
  imports: [BookModule, ConfigModule, DatabaseModule, GraphQLModule],
})
export class AppModule {}
