import { LeaveStatus } from '@prisma/client';
export declare class ReviewLeaveDto {
    status: LeaveStatus;
    adminComment?: string;
}
