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
    return new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
  }

  async todayKpis(params: { shiftId?: string } = {}) {
    const today = this.startOfDayUtc(new Date());

    const employeeWhere: any = {};
    if (params.shiftId) {
      employeeWhere.shiftId = params.shiftId;
    }

    const [totalEmployees, employees] = await Promise.all([
      this.prisma.employee.count({ where: employeeWhere }),
      this.prisma.employee.findMany({
        where: employeeWhere,
        select: { id: true },
      }),
    ]);

    const employeeIds = employees.map((e) => e.id);

    const todayRecords = await this.prisma.attendanceRecord.findMany({
      where: {
        date: today,
        ...(employeeIds.length > 0 ? { employeeId: { in: employeeIds } } : {}),
      },
      select: { status: true },
    });

    const pendingLeaves = await this.prisma.leaveRequest.count({
      where: {
        status: 'PENDING',
        ...(employeeIds.length > 0 ? { employeeId: { in: employeeIds } } : {}),
      },
    });

    const present = todayRecords.filter((r) => r.status === 'PRESENT').length;
    const late = todayRecords.filter((r) => r.status === 'LATE').length;
    const halfDay = todayRecords.filter((r) => r.status === 'HALF_DAY').length;

    return {
      totalEmployees,
      today: { present, late, halfDay, recorded: todayRecords.length },
      pendingLeaves,
    };
  }

  async monthlyEmployeeSummary(params: {
    employeeId: string;
    year: number;
    month: number;
  }) {
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

    return {
      employeeId: params.employeeId,
      year: params.year,
      month: params.month,
      summary,
    };
  }

  async monthlyForRequester(params: {
    requester: { id: string; role: UserRole };
    queryEmployeeId?: string;
    year: number;
    month: number;
    shiftId?: string;
  }) {
    const { requester, queryEmployeeId, year, month, shiftId } = params;

    // EMPLOYEE role: only own records, shiftId ignored (they have their own employee record)
    if (requester.role === UserRole.EMPLOYEE) {
      const emp = await this.prisma.employee.findUnique({
        where: { userId: requester.id },
      });
      if (!emp) throw new NotFoundException('Employee profile not found');
      return this.monthlyEmployeeSummary({ employeeId: emp.id, year, month });
    }

    // ADMIN or MANAGER with specific employeeId: return that employee's summary
    if (queryEmployeeId) {
      return this.monthlyEmployeeSummary({
        employeeId: queryEmployeeId,
        year,
        month,
      });
    }

    // ADMIN or MANAGER without specific employeeId but with shiftId: aggregate shift
    if (shiftId) {
      // Get all employees in this shift
      const employees = await this.prisma.employee.findMany({
        where: { shiftId },
        select: { id: true },
      });
      const employeeIds = employees.map((e) => e.id);

      const from = new Date(Date.UTC(year, month - 1, 1));
      const to = new Date(Date.UTC(year, month, 0));

      const records = await this.prisma.attendanceRecord.findMany({
        where: {
          employeeId: { in: employeeIds },
          date: { gte: from, lte: to },
        },
        select: { status: true },
      });

      const summary = records.reduce(
        (acc, r) => {
          acc[r.status] = (acc[r.status] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      return { employeeId: `shift-${shiftId}`, year, month, summary };
    }

    // ADMIN/MANAGER without employeeId and without shiftId: fallback to requester's employee if exists, else error
    const emp = await this.prisma.employee.findUnique({
      where: { userId: requester.id },
    });
    if (!emp) {
      throw new BadRequestException(
        'employeeId or shiftId query parameter is required for users without an employee profile',
      );
    }
    return this.monthlyEmployeeSummary({ employeeId: emp.id, year, month });
  }
}
