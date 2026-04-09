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
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
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
            userId: string;
            shiftId: string | null;
        } | null;
    }>;
    listEmployees(params: {
        q?: string;
        skip?: number;
        take?: number;
    }): Promise<{
        items: ({
            shift: {
                id: string;
                name: string;
                startTime: string;
                endTime: string;
            } | null;
            user: {
                id: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.UserRole;
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
        })[];
        total: number;
        skip: number;
        take: number;
    }>;
    getEmployee(id: string): Promise<{
        shift: {
            id: string;
            name: string;
            startTime: string;
            endTime: string;
            workingDays: string;
            graceMinutes: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
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
    }>;
    updateEmployee(id: string, input: any): Promise<{
        shift: {
            id: string;
            name: string;
            startTime: string;
            endTime: string;
            workingDays: string;
            graceMinutes: number;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
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
    }>;
    deactivateEmployee(id: string): Promise<{
        ok: boolean;
    }>;
}
