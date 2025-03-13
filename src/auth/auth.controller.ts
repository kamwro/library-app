import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, HttpStatus } from '@nestjs/common';

import type { SuccessActionResponseDto } from '../book/dto/success-action-response.dto';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user-dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  readonly #authService: AuthService;
  constructor(authService: AuthService) {
    this.#authService = authService;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully registered' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong' })
  async register(@Body() createUserDto: CreateUserDto): Promise<SuccessActionResponseDto> {
    return await this.#authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Something went wrong' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Invalid credentials' })
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return await this.#authService.login(loginUserDto);
  }
}
