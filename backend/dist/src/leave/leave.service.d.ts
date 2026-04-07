import { PrismaService } from '../prisma.service';
import { LeaveStatus, LeaveType, UserRole } from '@prisma/client';
export declare class LeaveService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private startOfDayUtc;
    private daysBetweenInclusive;
    createForEmployee(params: {
        userId: string;
        leaveType: LeaveType;
        startDate: string;
        endDate: string;
        reason: string;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    }>;
    listForEmployee(userId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    }[]>;
    listAll(requester: {
        id: string;
        role: UserRole;
    }): Promise<({
        employee: {
            user: {
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            employeeCode: string;
            department: string;
            designation: string;
            joinDate: Date;
            phone: string;
            profilePhoto: string | null;
            shiftId: string | null;
            userId: string;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    })[]>;
    review(params: {
        requester: {
            id: string;
            role: UserRole;
        };
        leaveId: string;
        status: LeaveStatus;
        adminComment?: string;
    }): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.LeaveStatus;
        createdAt: Date;
        updatedAt: Date;
        employeeId: string;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        reviewedById: string | null;
    }>;
}
