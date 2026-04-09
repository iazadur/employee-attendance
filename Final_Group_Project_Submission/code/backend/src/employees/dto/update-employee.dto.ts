import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsDateString()
  joinDate?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  shiftId?: string | null;

  @IsOptional()
  @IsString()
  profilePhoto?: string | null;
}

