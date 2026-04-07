"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
let EmployeesService = class EmployeesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createEmployee(input) {
        const email = input.email.toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new common_1.BadRequestException('Email already exists');
        const passwordHash = await bcrypt.hash(input.password, 12);
        const employeeCount = await this.prisma.employee.count();
        const employeeCode = `EAS-${String(employeeCount + 1).padStart(4, '0')}`;
        return this.prisma.user.create({
            data: {
                email,
                name: input.name,
                passwordHash,
                role: client_1.UserRole.EMPLOYEE,
                employee: {
                    create: {
                        employeeCode,
                        department: input.department,
                        designation: input.designation,
                        joinDate: new Date(input.joinDate),
                        phone: input.phone,
                        shiftId: input.shiftId,
                    },
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                employee: true,
            },
        });
    }
    async listEmployees(params) {
        const skip = params.skip ?? 0;
        const take = params.take ?? 20;
        const q = params.q?.trim();
        const where = q
            ? {
                OR: [
                    { employeeCode: { contains: q, mode: 'insensitive' } },
                    { department: { contains: q, mode: 'insensitive' } },
                    { designation: { contains: q, mode: 'insensitive' } },
                    { user: { name: { contains: q, mode: 'insensitive' } } },
                    { user: { email: { contains: q, mode: 'insensitive' } } },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            this.prisma.employee.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, email: true, name: true, role: true } },
                    shift: { select: { id: true, name: true, startTime: true, endTime: true } },
                },
            }),
            this.prisma.employee.count({ where }),
        ]);
        return { items, total, skip, take };
    }
    async getEmployee(id) {
        const employee = await this.prisma.employee.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true, name: true, role: true } },
                shift: true,
            },
        });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        return employee;
    }
    async updateEmployee(id, input) {
        try {
            return await this.prisma.employee.update({
                where: { id },
                data: {
                    department: input.department,
                    designation: input.designation,
                    joinDate: input.joinDate ? new Date(input.joinDate) : undefined,
                    phone: input.phone,
                    shiftId: input.shiftId === null ? null : input.shiftId,
                    profilePhoto: input.profilePhoto === null ? null : input.profilePhoto,
                },
                include: { user: { select: { id: true, email: true, name: true, role: true } }, shift: true },
            });
        }
        catch {
            throw new common_1.NotFoundException('Employee not found');
        }
    }
    async deactivateEmployee(id) {
        const employee = await this.prisma.employee.findUnique({ where: { id } });
        if (!employee)
            throw new common_1.NotFoundException('Employee not found');
        await this.prisma.user.update({
            where: { id: employee.userId },
            data: { status: 'INACTIVE' },
        });
        return { ok: true };
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map