import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employees;
    constructor(employees: EmployeesService);
    create(dto: CreateEmployeeDto): Promise<{
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
    list(q?: string, skip?: string, take?: string): Promise<{
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
    get(id: string): Promise<{
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
    update(id: string, dto: UpdateEmployeeDto): Promise<{
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
    deactivate(id: string): Promise<{
        ok: boolean;
    }>;
}
