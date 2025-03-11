import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule, TypeOrmModule.forFeature([Book])],
  providers: [BookService, BookResolver, JwtService],
})
export class BookModule {}
