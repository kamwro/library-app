import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { USER_ROLE } from '../shared/const';


registerEnumType(USER_ROLE, { name: 'UserRole' });

@ObjectType()
@Entity()
@Index('idx_user_created_at', ['createdAt'])
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ nullable: false })
  email!: string;

  @Field()
  @Column({ nullable: false })
  firstName!: string;

  @Field()
  @Column({ nullable: false })
  lastName!: string;

  @Field()
  @Column({ nullable: false })
  password!: string;

  @Field(() => USER_ROLE)
  @Column({ type: 'enum', enum: USER_ROLE, default: USER_ROLE.USER })
  role!: keyof typeof USER_ROLE;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  createdAt!: Date;
}
