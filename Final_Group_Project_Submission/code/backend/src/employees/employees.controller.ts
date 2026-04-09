import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employees: EmployeesService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.employees.createEmployee(dto);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  list(
    @Query('q') q?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.employees.listEmployees({
      q,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.employees.getEmployee(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employees.updateEmployee(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deactivate(@Param('id') id: string) {
    return this.employees.deactivateEmployee(id);
  }
}
