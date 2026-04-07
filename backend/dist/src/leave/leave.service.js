"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let LeaveService = class LeaveService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    startOfDayUtc(d) {
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }
    daysBetweenInclusive(start, end) {
        const a = this.startOfDayUtc(start).getTime();
        const b = this.startOfDayUtc(end).getTime();
        if (b < a)
            return 0;
        return Math.floor((b - a) / 86400000) + 1;
    }
    async createForEmployee(params) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId: params.userId },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        const start = new Date(params.startDate);
        const end = new Date(params.endDate);
        const totalDays = this.daysBetweenInclusive(start, end);
        if (totalDays <= 0)
            throw new common_1.BadRequestException('Invalid date range');
        const today = this.startOfDayUtc(new Date());
        if (this.startOfDayUtc(start) < today)
            throw new common_1.BadRequestException('Cannot request leave for past dates');
        return this.prisma.leaveRequest.create({
            data: {
                employeeId: employee.id,
                leaveType: params.leaveType,
                startDate: this.startOfDayUtc(start),
                endDate: this.startOfDayUtc(end),
                totalDays,
                reason: params.reason,
                status: client_1.LeaveStatus.PENDING,
            },
        });
    }
    async listForEmployee(userId) {
        const employee = await this.prisma.employee.findUnique({ where: { userId } });
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        return this.prisma.leaveRequest.findMany({
            where: { employeeId: employee.id },
            orderBy: { createdAt: 'desc' },
        });
    }
    async listAll(requester) {
        if (requester.role !== client_1.UserRole.ADMIN && requester.role !== client_1.UserRole.MANAGER)
            throw new common_1.BadRequestException('Not allowed');
        return this.prisma.leaveRequest.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                employee: {
                    include: { user: { select: { email: true, name: true } } },
                },
            },
        });
    }
    async review(params) {
        if (params.requester.role !== client_1.UserRole.ADMIN && params.requester.role !== client_1.UserRole.MANAGER)
            throw new common_1.BadRequestException('Not allowed');
        if (params.status !== client_1.LeaveStatus.APPROVED &&
            params.status !== client_1.LeaveStatus.REJECTED)
            throw new common_1.BadRequestException('Invalid review status');
        try {
            return await this.prisma.leaveRequest.update({
                where: { id: params.leaveId },
                data: {
                    status: params.status,
                    adminComment: params.adminComment,
                    reviewedById: params.requester.id,
                    reviewedAt: new Date(),
                },
            });
        }
        catch {
            throw new common_1.NotFoundException('Leave request not found');
        }
    }
};
exports.LeaveService = LeaveService;
exports.LeaveService = LeaveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveService);
//# sourceMappingURL=leave.service.js.map