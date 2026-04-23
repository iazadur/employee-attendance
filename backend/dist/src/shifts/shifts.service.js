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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ShiftsService = class ShiftsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(input) {
        return this.prisma.shift.create({ data: input });
    }
    list() {
        return this.prisma.shift.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async get(id) {
        const shift = await this.prisma.shift.findUnique({ where: { id } });
        if (!shift)
            throw new common_1.NotFoundException('Shift not found');
        return shift;
    }
    async update(id, input) {
        try {
            return await this.prisma.shift.update({
                where: { id },
                data: input,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                'code' in error &&
                error.code === 'P2025') {
                throw new common_1.NotFoundException('Shift not found');
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.prisma.shift.delete({ where: { id } });
            return { ok: true };
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Shift not found');
            }
            if (error.code === 'P2003' || error.code === 'P2002') {
                throw new common_1.ConflictException('Cannot delete shift: it is assigned to one or more employees');
            }
            throw error;
        }
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map