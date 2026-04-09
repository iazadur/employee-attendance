import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(input: {
    email: string;
    name: string;
    passwordHash: string;
    role?: UserRole;
    status?: UserStatus;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash: input.passwordHash,
        role: input.role ?? UserRole.EMPLOYEE,
        status: input.status ?? UserStatus.ACTIVE,
      },
    });
  }

  async listUsers(params: { skip?: number; take?: number }) {
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return { items, total, skip, take };
  }
}
