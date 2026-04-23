import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import {
  IsTimeFormat,
  IsEndTimeAfterStart,
  IsValidWorkingDays,
} from '../validators/shift-validators';

export class CreateShiftDto {
  @IsString()
  name!: string;

  @IsString()
  @IsTimeFormat()
  startTime!: string; // "HH:mm"

  @IsString()
  @IsTimeFormat()
  @IsEndTimeAfterStart('startTime')
  endTime!: string; // "HH:mm"

  @IsString()
  @IsValidWorkingDays()
  workingDays!: string; // "Mon,Tue,Wed,Thu,Fri"

  @IsOptional()
  @IsInt()
  @Min(0)
  graceMinutes?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
