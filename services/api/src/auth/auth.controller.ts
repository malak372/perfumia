import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

import { AuthService } from './auth.service.js';

import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendVerificationDto } from './dto/resend-verification.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  register(
    @Body()
    dto: RegisterDto,
  ) {
    return this.authService
      .register(dto);
  }

  @Public()
  @Post('verify-email')
  verifyEmail(
    @Body()
    dto: VerifyEmailDto,
  ) {
    return this.authService
      .verifyEmail(dto);
  }

  @Public()
  @Post(
    'resend-verification',
  )
  resendVerification(
    @Body()
    dto: ResendVerificationDto,
  ) {
    return this.authService
      .resendVerification(
        dto,
      );
  }

  @Public()
  @Post('login')
  login(
    @Body()
    dto: LoginDto,
  ) {
    return this.authService
      .login(dto);
  }

  @Public()
  @Post('refresh')
  refresh(
    @Body()
    dto: RefreshTokenDto,
  ) {
    return this.authService
      .refresh(dto);
  }

  @ApiBearerAuth(
    'access-token',
  )
  @Get('me')
  me(
    @CurrentUser()
    user: unknown,
  ) {
    return user;
  }
}