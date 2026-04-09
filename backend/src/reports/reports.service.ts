import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private startOfDayUtc(d: Date) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  async todayKpis() {
    const today = this.startOfDayUtc(new Date());

    const [totalEmployees, todayRecords, pendingLeaves] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.attendanceRecord.findMany({
        where: { date: today },
        select: { status: true },
      }),
      this.prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
    ]);

    const present = todayRecords.filter((r) => r.status === 'PRESENT').length;
    const late = todayRecords.filter((r) => r.status === 'LATE').length;
    const halfDay = todayRecords.filter((r) => r.status === 'HALF_DAY').length;

    return {
      totalEmployees,
      today: { present, late, halfDay, recorded: todayRecords.length },
      pendingLeaves,
    };
  }

  async monthlyEmployeeSummary(params: { employeeId: string; year: number; month: number }) {
    const from = new Date(Date.UTC(params.year, params.month - 1, 1));
    const to = new Date(Date.UTC(params.year, params.month, 0));

    const records = await this.prisma.attendanceRecord.findMany({
      where: { employeeId: params.employeeId, date: { gte: from, lte: to } },
      select: { status: true },
    });

    const summary = records.reduce(
      (acc, r) => {
        acc[r.status] = (acc[r.status] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { employeeId: params.employeeId, year: params.year, month: params.month, summary };
  }

  async monthlyForRequester(params: {
    requester: { id: string; role: UserRole };
    queryEmployeeId?: string;
    year: number;
    month: number;
  }) {
    const { requester, queryEmployeeId, year, month } = params;

    if (requester.role === UserRole.EMPLOYEE) {
      const emp = await this.prisma.employee.findUnique({
        where: { userId: requester.id },
      });
      if (!emp) throw new NotFoundException('Employee profile not found');
      return this.monthlyEmployeeSummary({ employeeId: emp.id, year, month });
    }

    if (queryEmployeeId) {
      return this.monthlyEmployeeSummary({
        employeeId: queryEmployeeId,
        year,
        month,
      });
    }

    const emp = await this.prisma.employee.findUnique({
      where: { userId: requester.id },
    });
    if (!emp) {
      throw new BadRequestException(
        'employeeId query parameter is required for users without an employee profile',
      );
    }
    return this.monthlyEmployeeSummary({ employeeId: emp.id, year, month });
  }
}
