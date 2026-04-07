import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
export declare class ShiftsController {
    private readonly shifts;
    constructor(shifts: ShiftsService);
    create(dto: CreateShiftDto): import("@prisma/client").Prisma.Prisma__ShiftClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
    }[]>;
    get(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
    }>;
    update(id: string, dto: UpdateShiftDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
