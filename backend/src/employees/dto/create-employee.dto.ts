import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsEmail()
  email!: string;

  @IsString()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  department!: string;

  @IsString()
  designation!: string;

  @IsDateString()
  joinDate!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  shiftId?: string;
}
