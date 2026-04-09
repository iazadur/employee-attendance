import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AttendanceService } from './attendance.service';
import { AttendanceQueryDto } from './dto/attendance-query.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendance: AttendanceService) {}

  @Post('check-in')
  checkIn(@Req() req: Request) {
    const user = (req as any).user as { id: string };
    return this.attendance.checkIn(user.id);
  }

  @Post('check-out')
  checkOut(@Req() req: Request) {
    const user = (req as any).user as { id: string };
    return this.attendance.checkOut(user.id);
  }

  @Get()
  list(@Req() req: Request, @Query() query: AttendanceQueryDto) {
    const user = (req as any).user as { id: string; role: any };
    return this.attendance.list({
      requester: { id: user.id, role: user.role },
      employeeId: query.employeeId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });
  }
}
