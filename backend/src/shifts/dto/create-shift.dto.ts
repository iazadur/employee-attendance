import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  name!: string;

  @IsString()
  startTime!: string; // "HH:mm"

  @IsString()
  endTime!: string; // "HH:mm"

  @IsString()
  workingDays!: string; // "Mon,Tue,Wed,Thu,Fri"

  @IsOptional()
  @IsInt()
  @Min(0)
  graceMinutes?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

