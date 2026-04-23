import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserStatus } from '@prisma/client';

type JwtPayload = {
  sub: string;
};

function cookieExtractor(req: Request, cookieName: string): string | null {
  const anyReq = req as unknown as { cookies?: Record<string, string> };
  return anyReq.cookies?.[cookieName] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    const cookieName = config.get<string>('COOKIE_NAME') ?? 'eas_token';
    super({
      jwtFromRequest: (req: Request) => cookieExtractor(req, cookieName),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Invalid session');
    if (user.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException('Account is not active');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
