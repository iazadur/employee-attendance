import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
export declare class ShiftsController {
    private readonly shifts;
    constructor(shifts: ShiftsService);
    list(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    get(id: string): Promise<{
        id: string;
        name: string;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateShiftDto): import(".prisma/client").Prisma.Prisma__ShiftClient<{
        id: string;
        name: string;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateShiftDto): Promise<{
        id: string;
        name: string;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
