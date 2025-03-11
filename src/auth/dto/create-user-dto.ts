import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength, Matches, IsEnum } from 'class-validator';
import { USER_ROLE } from '../../shared/const';

export class CreateUserDto {
  @ApiProperty({ example: 'john', description: 'User given name' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'doe', description: 'User family name' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'P@ssw0rd', description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
  })
  password!: string;

  @ApiProperty({ example: 'ADMIN', description: 'A role' })
  @IsEnum(USER_ROLE)
  @IsNotEmpty()
  role!: string;
}