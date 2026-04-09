import { PrismaService } from '../prisma.service';
export declare class ShiftsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: any): import("@prisma/client").Prisma.Prisma__ShiftClient<{
        id: string;
        name: string;
        startTime: string;
        endTime: string;
        workingDays: string;
        graceMinutes: number;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(): import("@prisma/client").Prisma.PrismaPromise<{
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
    update(id: string, input: any): Promise<{
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
