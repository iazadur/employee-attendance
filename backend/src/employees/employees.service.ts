import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployee(input: {
    email: string;
    name: string;
    password: string;
    department: string;
    designation: string;
    joinDate: string;
    phone: string;
    shiftId?: string;
  }) {
    const email = input.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(input.password, 12);

    const employeeCount = await this.prisma.employee.count();
    const employeeCode = `EAS-${String(employeeCount + 1).padStart(4, '0')}`;

    return this.prisma.user.create({
      data: {
        email,
        name: input.name,
        passwordHash,
        role: UserRole.EMPLOYEE,
        employee: {
          create: {
            employeeCode,
            department: input.department,
            designation: input.designation,
            joinDate: new Date(input.joinDate),
            phone: input.phone,
            shiftId: input.shiftId,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        employee: true,
      },
    });
  }

  async listEmployees(params: { q?: string; skip?: number; take?: number }) {
    const skip = params.skip ?? 0;
    const take = params.take ?? 20;
    const q = params.q?.trim();

    const where = q
      ? {
          OR: [
            { employeeCode: { contains: q, mode: 'insensitive' as const } },
            { department: { contains: q, mode: 'insensitive' as const } },
            { designation: { contains: q, mode: 'insensitive' as const } },
            { user: { name: { contains: q, mode: 'insensitive' as const } } },
            { user: { email: { contains: q, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, name: true, role: true } },
          shift: {
            select: { id: true, name: true, startTime: true, endTime: true },
          },
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async getEmployee(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true, role: true } },
        shift: true,
      },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async updateEmployee(id: string, input: any) {
    try {
      return await this.prisma.employee.update({
        where: { id },
        data: {
          department: input.department,
          designation: input.designation,
          joinDate: input.joinDate ? new Date(input.joinDate) : undefined,
          phone: input.phone,
          shiftId: input.shiftId === null ? null : input.shiftId,
          profilePhoto: input.profilePhoto === null ? null : input.profilePhoto,
        },
        include: {
          user: { select: { id: true, email: true, name: true, role: true } },
          shift: true,
        },
      });
    } catch {
      throw new NotFoundException('Employee not found');
    }
  }

  async deactivateEmployee(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');

    await this.prisma.user.update({
      where: { id: employee.userId },
      data: { status: 'INACTIVE' },
    });

    return { ok: true };
  }
}
