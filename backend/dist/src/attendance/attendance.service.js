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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
let AttendanceService = class AttendanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    startOfDayUtc(d) {
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    }
    parseHHmm(value) {
        const [hh, mm] = value.split(':').map((x) => Number(x));
        if (!Number.isFinite(hh) || !Number.isFinite(mm))
            return NaN;
        return hh * 60 + mm;
    }
    minutesSinceStartOfDayUtc(d) {
        return d.getUTCHours() * 60 + d.getUTCMinutes();
    }
    async checkIn(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
            include: { shift: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        const now = new Date();
        const date = this.startOfDayUtc(now);
        const existing = await this.prisma.attendanceRecord.findUnique({
            where: { employeeId_date: { employeeId: employee.id, date } },
        });
        if (existing?.checkIn)
            throw new common_1.BadRequestException('Already checked in');
        let status = client_1.AttendanceStatus.PRESENT;
        let shiftStartMin;
        let grace = 0;
        if (employee.shift) {
            shiftStartMin = this.parseHHmm(employee.shift.startTime);
            grace = employee.shift.graceMinutes ?? 0;
            const nowMin = this.minutesSinceStartOfDayUtc(now);
            if (Number.isFinite(shiftStartMin) && nowMin > shiftStartMin + grace) {
                status = client_1.AttendanceStatus.LATE;
            }
        }
        const record = await this.prisma.attendanceRecord.upsert({
            where: { employeeId_date: { employeeId: employee.id, date } },
            create: {
                employeeId: employee.id,
                date,
                checkIn: now,
                status,
                source: client_1.AttendanceSource.WEB,
                shiftId: employee.shift?.id ?? null,
                shiftName: employee.shift?.name ?? null,
                shiftStartTime: employee.shift?.startTime ?? null,
                shiftEndTime: employee.shift?.endTime ?? null,
                shiftGraceMinutes: employee.shift?.graceMinutes ?? null,
            },
            update: {
                checkIn: now,
                status,
                source: client_1.AttendanceSource.WEB,
            },
        });
        return record;
    }
    async checkOut(userId) {
        const employee = await this.prisma.employee.findUnique({
            where: { userId },
            include: { shift: true },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee profile not found');
        const now = new Date();
        const date = this.startOfDayUtc(now);
        const existing = await this.prisma.attendanceRecord.findUnique({
            where: { employeeId_date: { employeeId: employee.id, date } },
        });
        if (!existing?.checkIn)
            throw new common_1.BadRequestException('Not checked in yet');
        if (existing.checkOut)
            throw new common_1.BadRequestException('Already checked out');
        const totalMinutes = Math.max(0, Math.round((now.getTime() - existing.checkIn.getTime()) / 60000));
        let status = existing.status;
        if (employee.shift) {
            const shiftStartMin = this.parseHHmm(employee.shift.startTime);
            const shiftEndMin = this.parseHHmm(employee.shift.endTime);
            const shiftDuration = Number.isFinite(shiftStartMin) && Number.isFinite(shiftEndMin)
                ? Math.max(0, shiftEndMin - shiftStartMin)
                : null;
            if (shiftDuration !== null) {
                const halfDay = totalMinutes < Math.floor(shiftDuration / 2);
                status = halfDay ? client_1.AttendanceStatus.HALF_DAY : existing.status;
            }
        }
        return this.prisma.attendanceRecord.update({
            where: { id: existing.id },
            data: {
                checkOut: now,
                totalMinutes,
                status,
                source: client_1.AttendanceSource.WEB,
            },
        });
    }
    async list(params) {
        const requesterEmployee = await this.prisma.employee.findUnique({
            where: { userId: params.requester.id },
        });
        const isAdminOrManager = params.requester.role === client_1.UserRole.ADMIN ||
            params.requester.role === client_1.UserRole.MANAGER;
        const where = {};
        if (isAdminOrManager) {
            if (params.employeeId) {
                where.employeeId = params.employeeId;
            }
        }
        else {
            if (!requesterEmployee?.id) {
                throw new common_1.BadRequestException('Employee profile not found');
            }
            where.employeeId = requesterEmployee.id;
        }
        if (params.dateFrom || params.dateTo) {
            where.date = {};
            if (params.dateFrom)
                where.date.gte = this.startOfDayUtc(new Date(params.dateFrom));
            if (params.dateTo)
                where.date.lte = this.startOfDayUtc(new Date(params.dateTo));
        }
        return this.prisma.attendanceRecord.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map