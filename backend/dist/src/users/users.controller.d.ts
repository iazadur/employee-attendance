import type { Request } from 'express';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    me(req: Request): {
        user: any;
    };
    list(skip?: string, take?: string): Promise<{
        items: {
            id: string;
            name: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
        }[];
        total: number;
        skip: number;
        take: number;
    }>;
}
