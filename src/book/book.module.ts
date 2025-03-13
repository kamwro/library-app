import { Book } from './book.entity';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { User } from '../user/user.entity';
import { ReservationLogService } from '../reservation-log/reservation-log.service';
import {
  ReservationLogModel,
  ReservationLogSchema,
} from '../reservation-log/reservation-log.schema';

import { BookService } from './book.service';
import { BookResolver } from './book.resolver';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([Book, User]),
    MongooseModule.forFeature([{ name: ReservationLogModel.name, schema: ReservationLogSchema }]),
  ],
  providers: [BookService, BookResolver, JwtService, ReservationLogService],
})
export class BookModule {}
