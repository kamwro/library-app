import { Book } from './book.entity';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { User } from '../user/user.entity';

import { BookService } from './book.service';
import { BookResolver } from './book.resolver';

@Module({
  imports: [ConfigModule, AuthModule, TypeOrmModule.forFeature([Book, User])],
  providers: [BookService, BookResolver, JwtService],
})
export class BookModule {}
