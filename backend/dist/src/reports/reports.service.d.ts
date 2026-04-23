import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private startOfDayUtc;
    todayKpis(params?: {
        shiftId?: string;
    }): Promise<{
        totalEmployees: number;
        today: {
            present: number;
            late: number;
            halfDay: number;
            recorded: number;
        };
        pendingLeaves: number;
    }>;
    monthlyEmployeeSummary(params: {
        employeeId: string;
        year: number;
        month: number;
    }): Promise<{
        employeeId: string;
        year: number;
        month: number;
        summary: Record<string, number>;
    }>;
    monthlyForRequester(params: {
        requester: {
            id: string;
            role: UserRole;
        };
        queryEmployeeId?: string;
        year: number;
        month: number;
        shiftId?: string;
    }): Promise<{
        employeeId: string;
        year: number;
        month: number;
        summary: Record<string, number>;
    }>;
}
