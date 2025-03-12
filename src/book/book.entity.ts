import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../user/user.entity';

@ObjectType()
@Entity()
@Index('idx_book_created_at', ['createdAt'])
export class Book {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ nullable: false })
  title!: string;

  @Field()
  @Column({ nullable: false })
  author!: string;

  @Field()
  @Column({ default: true, nullable: false })
  isAvailable!: boolean;

  @Field()
  @Column({ type: 'timestamp', nullable: true })
  reservedAt!: Date;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.reservations, { nullable: true })
  reservedBy!: User;
}
