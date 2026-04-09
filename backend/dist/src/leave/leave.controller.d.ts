import type { Request } from 'express';
import { LeaveService } from './leave.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { ReviewLeaveDto } from './dto/review-leave.dto';
export declare class LeaveController {
    private readonly leave;
    constructor(leave: LeaveService);
    create(req: Request, dto: CreateLeaveRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        employeeId: string;
        reviewedById: string | null;
    }>;
    mine(req: Request): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        employeeId: string;
        reviewedById: string | null;
    }[]>;
    listAll(req: Request): Promise<({
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
        status: import("@prisma/client").$Enums.LeaveStatus;
        leaveType: import("@prisma/client").$Enums.LeaveType;
        startDate: Date;
        endDate: Date;
        totalDays: number;
        reason: string;
        adminComment: string | null;
        reviewedAt: Date | null;
        employeeId: string;
        reviewedById: string | null;
    })[]>;
    review(req: Request, id: string, dto: ReviewLeaveDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveStatus;
        leaveType: import("@prisma/client").$Enums.LeaveType;
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
