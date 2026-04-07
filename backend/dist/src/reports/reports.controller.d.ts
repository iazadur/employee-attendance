import type { Request } from 'express';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reports;
    constructor(reports: ReportsService);
    today(): Promise<{
        totalEmployees: number;
        today: {
            present: number;
            late: number;
            halfDay: number;
            recorded: number;
        };
        pendingLeaves: number;
    }>;
    monthly(req: Request, employeeId: string | undefined, year: string, month: string): Promise<{
        employeeId: string;
        year: number;
        month: number;
        summary: Record<string, number>;
    }>;
}
