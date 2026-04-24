import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: any) {
    return this.prisma.shift.create({ data: input });
  }

  list() {
    return this.prisma.shift.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async get(id: string) {
    const shift = await this.prisma.shift.findUnique({ where: { id } });
    if (!shift) throw new NotFoundException('Shift not found');
    return shift;
  }

  async update(id: string, input: any) {
    try {
      return await this.prisma.shift.update({
        where: { id },
        data: input,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as any).code === 'P2025'
      ) {
        throw new NotFoundException('Shift not found');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.shift.delete({ where: { id } });
      return { ok: true };
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Shift not found');
      }
      // Prisma FK constraint error code for "delete violates foreign key constraint" is 'P2003' or 'P2002'? Actually P2003: Foreign key constraint failed.
      if (error.code === 'P2003' || error.code === 'P2002') {
        throw new ConflictException(
          'Cannot delete shift: it is assigned to one or more employees',
        );
      }
      throw error;
    }
  }
}
