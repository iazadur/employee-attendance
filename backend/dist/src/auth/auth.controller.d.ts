import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
type AuthenticatedRequest = Request & {
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
};
export declare class AuthController {
    private readonly auth;
    private readonly config;
    constructor(auth: AuthService, config: ConfigService);
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    logout(res: Response): {
        ok: boolean;
    };
    me(req: AuthenticatedRequest): {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    };
}
export {};
