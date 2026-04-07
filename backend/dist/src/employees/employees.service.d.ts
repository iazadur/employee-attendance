import { PrismaService } from '../prisma.service';
export declare class EmployeesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createEmployee(input: {
        email: string;
        name: string;
        password: string;
        department: string;
        designation: string;
        joinDate: string;
        phone: string;
        shiftId?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
        employee: {
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
        } | null;
    }>;
    listEmployees(params: {
        q?: string;
        skip?: number;
        take?: number;
    }): Promise<{
        items: ({
            user: {
                id: string;
                email: string;
                name: string;
                role: import("@prisma/client").$Enums.UserRole;
            };
            shift: {
                id: string;
                name: string;
                startTime: string;
                endTime: string;
            } | null;
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
        })[];
        total: number;
        skip: number;
        take: number;
    }>;
    getEmployee(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        shift: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: string;
            endTime: string;
            workingDays: string;
            graceMinutes: number;
            description: string | null;
        } | null;
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
    }>;
    updateEmployee(id: string, input: any): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
        shift: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            startTime: string;
            endTime: string;
            workingDays: string;
            graceMinutes: number;
            description: string | null;
        } | null;
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
    }>;
    deactivateEmployee(id: string): Promise<{
        ok: boolean;
    }>;
}
