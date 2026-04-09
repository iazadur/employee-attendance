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
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LeaveStatus;
        leaveType: import(".prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        employeeId: string;
        reviewedById: string | null;
    }>;
    listForEmployee(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LeaveStatus;
        leaveType: import(".prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        employeeId: string;
        reviewedById: string | null;
    }[]>;
    listAll(requester: {
        id: string;
        role: UserRole;
    }): Promise<({
        employee: {
            user: {
                name: string;
                email: string;
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
            userId: string;
            shiftId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LeaveStatus;
        leaveType: import(".prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        employeeId: string;
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
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.LeaveStatus;
        leaveType: import(".prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        employeeId: string;
        reviewedById: string | null;
    }>;
}
