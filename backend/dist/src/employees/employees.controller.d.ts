import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeesController {
    private readonly employees;
    constructor(employees: EmployeesService);
    create(dto: CreateEmployeeDto): Promise<{
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
    list(q?: string, skip?: string, take?: string): Promise<{
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
    get(id: string): Promise<{
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
    update(id: string, dto: UpdateEmployeeDto): Promise<{
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
    deactivate(id: string): Promise<{
        ok: boolean;
    }>;
}
