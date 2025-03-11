import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';

import type { SuccessActionResponseDto } from '../book/dto/success-action-response.dto';
import { USER_ROLE } from '../shared/const';
import { User } from '../user/user.entity';

import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class AuthService {
  readonly #userRepository: Repository<User>;
  readonly #jwtService: JwtService;
  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    jwtService: JwtService,
  ) {
    this.#userRepository = userRepository;
    this.#jwtService = jwtService;
  }

  async register(createUserDto: CreateUserDto): Promise<SuccessActionResponseDto> {
    const { email, password, firstName, lastName, role } = createUserDto;

    const doesUserExist = await this.#userRepository.findOne({ where: { email } });

    if (doesUserExist) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.#userRepository.create({
      email,
      firstName,
      lastName,
      role: role as keyof typeof USER_ROLE,
      password: hashedPassword,
    });

    await this.#userRepository.save(newUser);

    return { message: 'Successfully created an user' };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    const user = await this.#userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Password do not match');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      accessToken: this.#jwtService.sign(payload),
    };
  }

  static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
