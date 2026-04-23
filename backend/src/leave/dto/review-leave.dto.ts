import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeaveStatus } from '@prisma/client';

export class ReviewLeaveDto {
  @IsEnum(LeaveStatus)
  status!: LeaveStatus; // APPROVED or REJECTED

  @IsOptional()
  @IsString()
  adminComment?: string;
}
