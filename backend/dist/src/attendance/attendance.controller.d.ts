import type { Request } from 'express';
import { AttendanceService } from './attendance.service';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
export declare class AttendanceController {
    private readonly attendance;
    constructor(attendance: AttendanceService);
    checkIn(req: Request): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        totalMinutes: number | null;
        source: import("@prisma/client").$Enums.AttendanceSource;
        isManualOverride: boolean;
        overriddenById: string | null;
    }>;
    checkOut(req: Request): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        totalMinutes: number | null;
        source: import("@prisma/client").$Enums.AttendanceSource;
        isManualOverride: boolean;
        overriddenById: string | null;
    }>;
    list(req: Request, query: AttendanceQueryDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        employeeId: string;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        totalMinutes: number | null;
        source: import("@prisma/client").$Enums.AttendanceSource;
        isManualOverride: boolean;
        overriddenById: string | null;
    }[]>;
}
