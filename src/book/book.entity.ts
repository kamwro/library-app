import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt!: Date | null;
}
