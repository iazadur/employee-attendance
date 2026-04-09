import { Injectable, NotFoundException } from '@nestjs/common';
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
    } catch {
      throw new NotFoundException('Shift not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.shift.delete({ where: { id } });
      return { ok: true };
    } catch {
      throw new NotFoundException('Shift not found');
    }
  }
}
