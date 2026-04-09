import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

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
    const secure =
      (this.config.get<string>('COOKIE_SECURE') ?? 'false') === 'true';
    const sameSiteRaw = (
      this.config.get<string>('COOKIE_SAME_SITE') ?? 'lax'
    ).toLowerCase();
    const sameSite: CookieOptions['sameSite'] =
      sameSiteRaw === 'strict' || sameSiteRaw === 'none' ? sameSiteRaw : 'lax';
    const cookieSecure = sameSite === 'none' ? true : secure;

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite,
      path: '/',
      maxAge: 8 * 60 * 60 * 1000,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const cookieName = this.config.get<string>('COOKIE_NAME') ?? 'eas_token';
    const secure =
      (this.config.get<string>('COOKIE_SECURE') ?? 'false') === 'true';
    const sameSiteRaw = (
      this.config.get<string>('COOKIE_SAME_SITE') ?? 'lax'
    ).toLowerCase();
    const sameSite: CookieOptions['sameSite'] =
      sameSiteRaw === 'strict' || sameSiteRaw === 'none' ? sameSiteRaw : 'lax';
    const cookieSecure = sameSite === 'none' ? true : secure;
    res.clearCookie(cookieName, { path: '/', secure: cookieSecure, sameSite });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return { user: req.user };
  }
}
