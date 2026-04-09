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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    startOfDayUtc(d) {
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }
    async todayKpis() {
        const today = this.startOfDayUtc(new Date());
        const [totalEmployees, todayRecords, pendingLeaves] = await Promise.all([
            this.prisma.employee.count(),
            this.prisma.attendanceRecord.findMany({
                where: { date: today },
                select: { status: true },
            }),
            this.prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
        ]);
        const present = todayRecords.filter((r) => r.status === 'PRESENT').length;
        const late = todayRecords.filter((r) => r.status === 'LATE').length;
        const halfDay = todayRecords.filter((r) => r.status === 'HALF_DAY').length;
        return {
            totalEmployees,
            today: { present, late, halfDay, recorded: todayRecords.length },
            pendingLeaves,
        };
    }
    async monthlyEmployeeSummary(params) {
        const from = new Date(Date.UTC(params.year, params.month - 1, 1));
        const to = new Date(Date.UTC(params.year, params.month, 0));
        const records = await this.prisma.attendanceRecord.findMany({
            where: { employeeId: params.employeeId, date: { gte: from, lte: to } },
            select: { status: true },
        });
        const summary = records.reduce((acc, r) => {
            acc[r.status] = (acc[r.status] ?? 0) + 1;
            return acc;
        }, {});
        return { employeeId: params.employeeId, year: params.year, month: params.month, summary };
    }
    async monthlyForRequester(params) {
        const { requester, queryEmployeeId, year, month } = params;
        if (requester.role === client_1.UserRole.EMPLOYEE) {
            const emp = await this.prisma.employee.findUnique({
                where: { userId: requester.id },
            });
            if (!emp)
                throw new common_1.NotFoundException('Employee profile not found');
            return this.monthlyEmployeeSummary({ employeeId: emp.id, year, month });
        }
        if (queryEmployeeId) {
            return this.monthlyEmployeeSummary({
                employeeId: queryEmployeeId,
                year,
                month,
            });
        }
        const emp = await this.prisma.employee.findUnique({
            where: { userId: requester.id },
        });
        if (!emp) {
            throw new common_1.BadRequestException('employeeId query parameter is required for users without an employee profile');
        }
        return this.monthlyEmployeeSummary({ employeeId: emp.id, year, month });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map