import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';

import { ReservationLogController } from './reservation-log.controller';
import { ReservationLogModel, ReservationLogSchema } from './reservation-log.schema';
import { ReservationLogService } from './reservation-log.service';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    MongooseModule.forFeature([{ name: ReservationLogModel.name, schema: ReservationLogSchema }]),
  ],
  providers: [ReservationLogService, JwtService],
  controllers: [ReservationLogController],
  exports: [ReservationLogService],
})
export class ReservationLogModule {}
