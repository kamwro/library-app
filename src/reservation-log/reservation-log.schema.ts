import { Schema, type Document, model } from 'mongoose';

export interface ReservationLog extends Document {
  userId: string;
  bookId: string;
  action: 'reserve';
  timestamp: Date;
}

export const ReservationLogSchema = new Schema<ReservationLog>(
  {
    userId: { type: String, required: true },
    bookId: { type: String, required: true },
    action: { type: String, required: true, enum: ['reserve'] },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const ReservationLogModel = model<ReservationLog>('ReservationLog', ReservationLogSchema);
