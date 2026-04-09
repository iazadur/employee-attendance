import { PrismaService } from '../prisma.service';
import { UserRole } from '@prisma/client';
export declare class AttendanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private startOfDayUtc;
    private parseHHmm;
    private minutesSinceStartOfDayUtc;
    checkIn(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        totalMinutes: number | null;
        source: import(".prisma/client").$Enums.AttendanceSource;
        isManualOverride: boolean;
        overriddenById: string | null;
    }>;
    checkOut(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        totalMinutes: number | null;
        source: import(".prisma/client").$Enums.AttendanceSource;
        isManualOverride: boolean;
        overriddenById: string | null;
    }>;
    list(params: {
        requester: {
            id: string;
            role: UserRole;
        };
        employeeId?: string;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        totalMinutes: number | null;
        source: import(".prisma/client").$Enums.AttendanceSource;
        isManualOverride: boolean;
        overriddenById: string | null;
    }[]>;
}
