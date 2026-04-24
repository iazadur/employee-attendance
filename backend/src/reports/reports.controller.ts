import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('today')
  today(@Query('shiftId') shiftId?: string) {
    return this.reports.todayKpis({ shiftId });
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @Get('monthly')
  monthly(
    @Req() req: Request,
    @Query('employeeId') employeeId: string | undefined,
    @Query('shiftId') shiftId: string | undefined,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const user = (req as any).user as { id: string; role: UserRole };
    const y = Number(year);
    const m = Number(month);

    return this.reports.monthlyForRequester({
      requester: user,
      queryEmployeeId: employeeId,
      year: y,
      month: m,
      shiftId,
    });
  }
}
