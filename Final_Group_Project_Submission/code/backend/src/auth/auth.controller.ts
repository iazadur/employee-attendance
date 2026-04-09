import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const token = await this.auth.signToken({ id: user.id, role: user.role });

    const cookieName = this.config.get<string>('COOKIE_NAME') ?? 'eas_token';
    const secure = (this.config.get<string>('COOKIE_SECURE') ?? 'false') === 'true';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60 * 1000,
    });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieName = this.config.get<string>('COOKIE_NAME') ?? 'eas_token';
    res.clearCookie(cookieName, { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return { user: (req as any).user };
  }
}
