import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import {
  IsTimeFormat,
  IsEndTimeAfterStart,
  IsValidWorkingDays,
} from '../validators/shift-validators';

export class UpdateShiftDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @IsTimeFormat()
  startTime?: string;

  @IsOptional()
  @IsString()
  @IsTimeFormat()
  @IsEndTimeAfterStart('startTime')
  endTime?: string;

  @IsOptional()
  @IsString()
  @IsValidWorkingDays()
  workingDays?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  graceMinutes?: number;

  @IsOptional()
  @IsString()
  description?: string | null;
}
