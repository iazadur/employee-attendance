import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AttendanceSource, AttendanceStatus, UserRole } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private startOfDayUtc(d: Date) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  private parseHHmm(value: string): number {
    const [hh, mm] = value.split(':').map((x) => Number(x));
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return NaN;
    return hh * 60 + mm;
  }

  private minutesSinceStartOfDayUtc(d: Date): number {
    return d.getUTCHours() * 60 + d.getUTCMinutes();
  }

  async checkIn(userId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      include: { shift: true },
    });
    if (!employee) throw new NotFoundException('Employee profile not found');
    if (!employee.shift) throw new BadRequestException('No shift assigned');

    const now = new Date();
    const date = this.startOfDayUtc(now);

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: employee.id, date } },
    });
    if (existing?.checkIn) throw new BadRequestException('Already checked in');

    const shiftStartMin = this.parseHHmm(employee.shift.startTime);
    const grace = employee.shift.graceMinutes ?? 0;
    const nowMin = this.minutesSinceStartOfDayUtc(now);

    const status =
      Number.isFinite(shiftStartMin) && nowMin > shiftStartMin + grace
        ? AttendanceStatus.LATE
        : AttendanceStatus.PRESENT;

    const record = await this.prisma.attendanceRecord.upsert({
      where: { employeeId_date: { employeeId: employee.id, date } },
      create: {
        employeeId: employee.id,
        date,
        checkIn: now,
        status,
        source: AttendanceSource.WEB,
      },
      update: { checkIn: now, status, source: AttendanceSource.WEB },
    });

    return record;
  }

  async checkOut(userId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId },
      include: { shift: true },
    });
    if (!employee) throw new NotFoundException('Employee profile not found');
    if (!employee.shift) throw new BadRequestException('No shift assigned');

    const now = new Date();
    const date = this.startOfDayUtc(now);

    const existing = await this.prisma.attendanceRecord.findUnique({
      where: { employeeId_date: { employeeId: employee.id, date } },
    });
    if (!existing?.checkIn) throw new BadRequestException('Not checked in yet');
    if (existing.checkOut) throw new BadRequestException('Already checked out');

    const totalMinutes = Math.max(
      0,
      Math.round((now.getTime() - existing.checkIn.getTime()) / 60000),
    );

    const shiftStartMin = this.parseHHmm(employee.shift.startTime);
    const shiftEndMin = this.parseHHmm(employee.shift.endTime);
    const shiftDuration =
      Number.isFinite(shiftStartMin) && Number.isFinite(shiftEndMin)
        ? Math.max(0, shiftEndMin - shiftStartMin)
        : null;

    const halfDay =
      shiftDuration !== null ? totalMinutes < Math.floor(shiftDuration / 2) : false;

    const status = halfDay ? AttendanceStatus.HALF_DAY : existing.status;

    return this.prisma.attendanceRecord.update({
      where: { id: existing.id },
      data: {
        checkOut: now,
        totalMinutes,
        status,
        source: AttendanceSource.WEB,
      },
    });
  }

  async list(params: {
    requester: { id: string; role: UserRole };
    employeeId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const requesterEmployee = await this.prisma.employee.findUnique({
      where: { userId: params.requester.id },
    });

    const isAdminOrManager =
      params.requester.role === UserRole.ADMIN ||
      params.requester.role === UserRole.MANAGER;

    const where: any = {};

    if (isAdminOrManager) {
      if (params.employeeId) {
        where.employeeId = params.employeeId;
      }
    } else {
      if (!requesterEmployee?.id) {
        throw new BadRequestException('Employee profile not found');
      }
      where.employeeId = requesterEmployee.id;
    }
    if (params.dateFrom || params.dateTo) {
      where.date = {};
      if (params.dateFrom) where.date.gte = this.startOfDayUtc(new Date(params.dateFrom));
      if (params.dateTo) where.date.lte = this.startOfDayUtc(new Date(params.dateTo));
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }
}
