import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LeaveStatus, LeaveType, UserRole } from '@prisma/client';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaService) {}

  private startOfDayUtc(d: Date) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  private daysBetweenInclusive(start: Date, end: Date) {
    const a = this.startOfDayUtc(start).getTime();
    const b = this.startOfDayUtc(end).getTime();
    if (b < a) return 0;
    return Math.floor((b - a) / 86400000) + 1;
  }

  async createForEmployee(params: {
    userId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId: params.userId },
    });
    if (!employee) throw new NotFoundException('Employee profile not found');

    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const totalDays = this.daysBetweenInclusive(start, end);
    if (totalDays <= 0) throw new BadRequestException('Invalid date range');

    const today = this.startOfDayUtc(new Date());
    if (this.startOfDayUtc(start) < today)
      throw new BadRequestException('Cannot request leave for past dates');

    return this.prisma.leaveRequest.create({
      data: {
        employeeId: employee.id,
        leaveType: params.leaveType,
        startDate: this.startOfDayUtc(start),
        endDate: this.startOfDayUtc(end),
        totalDays,
        reason: params.reason,
        status: LeaveStatus.PENDING,
      },
    });
  }

  async listForEmployee(userId: string) {
    const employee = await this.prisma.employee.findUnique({ where: { userId } });
    if (!employee) throw new NotFoundException('Employee profile not found');

    return this.prisma.leaveRequest.findMany({
      where: { employeeId: employee.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listAll(requester: { id: string; role: UserRole }) {
    if (requester.role !== UserRole.ADMIN && requester.role !== UserRole.MANAGER)
      throw new BadRequestException('Not allowed');

    return this.prisma.leaveRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          include: { user: { select: { email: true, name: true } } },
        },
      },
    });
  }

  async review(params: {
    requester: { id: string; role: UserRole };
    leaveId: string;
    status: LeaveStatus;
    adminComment?: string;
  }) {
    if (params.requester.role !== UserRole.ADMIN && params.requester.role !== UserRole.MANAGER)
      throw new BadRequestException('Not allowed');

    if (
      params.status !== LeaveStatus.APPROVED &&
      params.status !== LeaveStatus.REJECTED
    )
      throw new BadRequestException('Invalid review status');

    try {
      return await this.prisma.leaveRequest.update({
        where: { id: params.leaveId },
        data: {
          status: params.status,
          adminComment: params.adminComment,
          reviewedById: params.requester.id,
          reviewedAt: new Date(),
        },
      });
    } catch {
      throw new NotFoundException('Leave request not found');
    }
  }
}
