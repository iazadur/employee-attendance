import { PrismaService } from '../prisma.service';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private startOfDayUtc;
    todayKpis(): Promise<{
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
}
