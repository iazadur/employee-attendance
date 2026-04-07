import { PrismaService } from '../prisma.service';
export declare class ShiftsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(input: any): import("@prisma/client").Prisma.Prisma__ShiftClient<{
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
    update(id: string, input: any): Promise<{
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
