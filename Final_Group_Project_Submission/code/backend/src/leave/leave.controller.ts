import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { LeaveService } from './leave.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ReviewLeaveDto } from './dto/review-leave.dto';

@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(private readonly leave: LeaveService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateLeaveRequestDto) {
    const user = (req as any).user as { id: string };
    return this.leave.createForEmployee({ userId: user.id, ...dto });
  }

  @Get('mine')
  mine(@Req() req: Request) {
    const user = (req as any).user as { id: string };
    return this.leave.listForEmployee(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get()
  listAll(@Req() req: Request) {
    const user = (req as any).user as { id: string; role: any };
    return this.leave.listAll({ id: user.id, role: user.role });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id/review')
  review(@Req() req: Request, @Param('id') id: string, @Body() dto: ReviewLeaveDto) {
    const user = (req as any).user as { id: string; role: any };
    return this.leave.review({
      requester: { id: user.id, role: user.role },
      leaveId: id,
      status: dto.status,
      adminComment: dto.adminComment,
    });
  }
}
