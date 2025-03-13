import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ReservationLog, ReservationLogModel } from './reservation-log.schema';

@Injectable()
export class ReservationLogService {
  readonly #reservationLogModel: Model<ReservationLog>;
  constructor(@InjectModel(ReservationLogModel.name) reservationLogModel: Model<ReservationLog>) {
    this.#reservationLogModel = reservationLogModel;
  }

  async createLog(userId: string, bookId: string, action: string): Promise<ReservationLog> {
    const log = new this.#reservationLogModel({
      userId,
      bookId,
      action,
    });

    return log.save();
  }

  async getLogs(): Promise<ReservationLog[]> {
    return this.#reservationLogModel.find().exec();
  }
}
