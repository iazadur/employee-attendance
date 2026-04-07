import { PrismaService } from '../prisma.service';
import { User, UserRole, UserStatus } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    createUser(input: {
        email: string;
        name: string;
        passwordHash: string;
        role?: UserRole;
        status?: UserStatus;
    }): Promise<User>;
    listUsers(params: {
        skip?: number;
        take?: number;
    }): Promise<{
        items: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
        }[];
        total: number;
        skip: number;
        take: number;
    }>;
}
