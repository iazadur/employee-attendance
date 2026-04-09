import { Injectable } from '@nestjs/common';
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
}
