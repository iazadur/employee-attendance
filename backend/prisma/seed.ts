import 'dotenv/config';
import {
  PrismaClient,
  UserRole,
  UserStatus,
  AttendanceStatus,
  AttendanceSource,
  LeaveType,
  LeaveStatus,
} from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'Asdf@123';

function startOfDayUtc(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function daysBetweenInclusiveUtc(start: Date, end: Date): number {
  const a = startOfDayUtc(start).getTime();
  const b = startOfDayUtc(end).getTime();
  if (b < a) return 0;
  return Math.floor((b - a) / 86400000) + 1;
}

/** Last 7 calendar days in UTC (inclusive), oldest first */
function last7DaysUtc(): Date[] {
  const today = startOfDayUtc(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (6 - i));
    return startOfDayUtc(d);
  });
}

function addUtcMinutes(
  baseUtcMidnight: Date,
  totalMinutesFromMidnight: number,
): Date {
  return new Date(
    baseUtcMidnight.getTime() + totalMinutesFromMidnight * 60_000,
  );
}

async function main() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- bcrypt default export resolution in tooling
  const passwordHash = (await hash(SEED_PASSWORD, 12)) as string;

  await prisma.$transaction([
    prisma.leaveRequest.deleteMany(),
    prisma.attendanceRecord.deleteMany(),
    prisma.employee.deleteMany(),
    prisma.user.deleteMany(),
    prisma.shift.deleteMany(),
  ]);

  const shiftMorning = await prisma.shift.create({
    data: {
      name: 'Morning (Corporate)',
      startTime: '09:00',
      endTime: '18:00',
      workingDays: 'Mon,Tue,Wed,Thu,Fri',
      graceMinutes: 15,
      description: 'Standard head office shift',
    },
  });

  const shiftEarly = await prisma.shift.create({
    data: {
      name: 'Early Bird',
      startTime: '07:30',
      endTime: '16:30',
      workingDays: 'Mon,Tue,Wed,Thu,Fri',
      graceMinutes: 10,
      description: 'Support and operations',
    },
  });

  const shiftFlex = await prisma.shift.create({
    data: {
      name: 'Flexible Hybrid',
      startTime: '10:00',
      endTime: '19:00',
      workingDays: 'Mon,Tue,Wed,Thu,Fri',
      graceMinutes: 20,
      description: 'Product and design',
    },
  });

  const shiftIds = [shiftMorning.id, shiftEarly.id, shiftFlex.id];

  const adminDefs = [
    { email: 'azad@gmail.com', name: 'Azad Hossain' },
    { email: 'rakib@gmail.com', name: 'Rakibul Islam' },
    { email: 'aduri@gmail.com', name: 'Aduri Akter' },
  ];

  const managerDefs = [
    { email: 'azad1@gmail.com', name: 'Azad Karim' },
    { email: 'rakib1@gmail.com', name: 'Rakib Hasan' },
    { email: 'aduri1@gmail.com', name: 'Aduri Sultana' },
  ];

  const departments = [
    'Engineering',
    'Engineering',
    'Engineering',
    'Engineering',
    'Engineering',
    'Engineering',
    'Engineering',
    'Engineering',
    'Product',
    'Product',
    'Product',
    'Product',
    'Human Resources',
    'Human Resources',
    'Human Resources',
    'Sales',
    'Sales',
    'Sales',
    'Sales',
    'Sales',
    'Operations',
    'Operations',
    'Operations',
    'Operations',
    'Operations',
    'Finance',
    'Finance',
    'Finance',
    'Finance',
    'Finance',
  ];

  const designations = [
    'Principal Engineer',
    'Senior Software Engineer',
    'Software Engineer',
    'Software Engineer',
    'QA Engineer',
    'DevOps Engineer',
    'Engineering Manager',
    'Junior Developer',
    'Product Manager',
    'Product Designer',
    'Associate PM',
    'UX Researcher',
    'HR Business Partner',
    'Talent Acquisition Specialist',
    'HR Executive',
    'Regional Sales Lead',
    'Account Executive',
    'Sales Development Rep',
    'Account Manager',
    'Customer Success Manager',
    'Operations Lead',
    'Logistics Coordinator',
    'Procurement Specialist',
    'Facilities Executive',
    'Office Administrator',
    'Financial Analyst',
    'Accountant',
    'Payroll Specialist',
    'Finance Manager',
    'Internal Auditor',
  ];

  const employeeNames = [
    'Sabbir Ahmed',
    'Nusrat Jahan',
    'Tanvir Alam',
    'Farhana Chowdhury',
    'Imran Hossain',
    'Mehedi Hasan',
    'Shaila Akter',
    'Arifin Shuvo',
    'Sumaiya Rahman',
    'Mahmudul Hasan',
    'Jannatul Ferdous',
    'Kamal Uddin',
    'Nadia Islam',
    'Omar Faruk',
    'Priya Saha',
    'Rafsan Kabir',
    'Tasnim Ahmed',
    'Yasin Arafat',
    'Zarin Tasnim',
    'Ahnaf Rahman',
    'Bushra Khan',
    'Chowdhury Saif',
    'Dilruba Yeasmin',
    'Ehsanul Karim',
    'Fahim Islam',
    'Golam Mawla',
    'Humayra Binte',
    'Irfan Mahmud',
    'Jubayer Ahmed',
    'Kabir Hossain',
  ];

  const admins = await Promise.all(
    adminDefs.map((a) =>
      prisma.user.create({
        data: {
          email: a.email.toLowerCase(),
          name: a.name,
          passwordHash,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
      }),
    ),
  );

  const managers = await Promise.all(
    managerDefs.map((m) =>
      prisma.user.create({
        data: {
          email: m.email.toLowerCase(),
          name: m.name,
          passwordHash,
          role: UserRole.MANAGER,
          status: UserStatus.ACTIVE,
        },
      }),
    ),
  );

  const employeeUsers = await Promise.all(
    employeeNames.map((name, i) =>
      prisma.user.create({
        data: {
          email: `e${i + 1}@gmail.com`.toLowerCase(),
          name,
          passwordHash,
          role: UserRole.EMPLOYEE,
          status: UserStatus.ACTIVE,
        },
      }),
    ),
  );

  const joinDates = employeeUsers.map((_, i) =>
    startOfDayUtc(new Date(Date.UTC(2022 + (i % 3), i % 12, 1 + (i % 20)))),
  );

  const employees = await Promise.all(
    employeeUsers.map((u, i) =>
      prisma.employee.create({
        data: {
          userId: u.id,
          employeeCode: `EMP-2024-${String(i + 1).padStart(3, '0')}`,
          department: departments[i],
          designation: designations[i],
          joinDate: joinDates[i],
          phone: `+88017${String(1000000 + i * 13789).slice(0, 8)}`,
          shiftId: shiftIds[i % shiftIds.length],
        },
      }),
    ),
  );

  const dayDates = last7DaysUtc();
  const primaryAdmin = admins[0];

  /** Approved / pending leave windows used to mark ON_LEAVE attendance */
  const leaveSeeds: Array<{
    employeeIndex: number;
    type: LeaveType;
    startOffset: number;
    endOffset: number;
    reason: string;
    status: LeaveStatus;
    reviewedBy?: (typeof admins)[0];
  }> = [
    {
      employeeIndex: 0,
      type: LeaveType.ANNUAL,
      startOffset: 2,
      endOffset: 3,
      reason: 'Family trip — approved annual leave',
      status: LeaveStatus.APPROVED,
      reviewedBy: primaryAdmin,
    },
    {
      employeeIndex: 3,
      type: LeaveType.SICK,
      startOffset: 1,
      endOffset: 2,
      reason: 'Fever and doctor visit',
      status: LeaveStatus.APPROVED,
      reviewedBy: primaryAdmin,
    },
    {
      employeeIndex: 7,
      type: LeaveType.CASUAL,
      startOffset: 4,
      endOffset: 4,
      reason: 'Personal work',
      status: LeaveStatus.APPROVED,
      reviewedBy: admins[1],
    },
    {
      employeeIndex: 11,
      type: LeaveType.ANNUAL,
      startOffset: 0,
      endOffset: 1,
      reason: 'Long weekend travel',
      status: LeaveStatus.PENDING,
    },
    {
      employeeIndex: 14,
      type: LeaveType.CASUAL,
      startOffset: 5,
      endOffset: 6,
      reason: 'Wedding ceremony',
      status: LeaveStatus.APPROVED,
      reviewedBy: admins[2],
    },
    {
      employeeIndex: 18,
      type: LeaveType.SICK,
      startOffset: 3,
      endOffset: 4,
      reason: 'Stomach bug',
      status: LeaveStatus.REJECTED,
      reviewedBy: primaryAdmin,
    },
    {
      employeeIndex: 22,
      type: LeaveType.UNPAID,
      startOffset: 2,
      endOffset: 4,
      reason: 'Extended personal leave (unpaid)',
      status: LeaveStatus.APPROVED,
      reviewedBy: admins[1],
    },
    {
      employeeIndex: 5,
      type: LeaveType.PATERNITY,
      startOffset: 1,
      endOffset: 5,
      reason: 'Newborn care',
      status: LeaveStatus.APPROVED,
      reviewedBy: primaryAdmin,
    },
    {
      employeeIndex: 27,
      type: LeaveType.ANNUAL,
      startOffset: 0,
      endOffset: 0,
      reason: 'One day recharge',
      status: LeaveStatus.CANCELLED,
      reviewedBy: primaryAdmin,
    },
  ];

  function isOnApprovedLeave(employeeIndex: number, day: Date): boolean {
    for (const L of leaveSeeds) {
      if (L.status !== LeaveStatus.APPROVED) continue;
      const start = dayDates[L.startOffset];
      const end = dayDates[L.endOffset];
      const t = startOfDayUtc(day).getTime();
      if (L.employeeIndex !== employeeIndex) continue;
      if (t >= start.getTime() && t <= end.getTime()) return true;
    }
    return false;
  }

  const attendanceRows: Array<{
    employeeId: string;
    date: Date;
    checkIn: Date | null;
    checkOut: Date | null;
    totalMinutes: number | null;
    status: AttendanceStatus;
    source: AttendanceSource;
  }> = [];

  for (const day of dayDates) {
    const dow = day.getUTCDay();
    const isWeekend = dow === 0 || dow === 6;

    for (let ei = 0; ei < employees.length; ei++) {
      const emp = employees[ei];
      let status: AttendanceStatus;

      if (isWeekend) {
        status =
          ei % 4 === 0 ? AttendanceStatus.HOLIDAY : AttendanceStatus.ABSENT;
      } else if (isOnApprovedLeave(ei, day)) {
        status = AttendanceStatus.ON_LEAVE;
      } else {
        const mix = (ei * 31 + day.getUTCDate()) % 11;
        if (mix <= 5) status = AttendanceStatus.PRESENT;
        else if (mix <= 7) status = AttendanceStatus.LATE;
        else if (mix === 8) status = AttendanceStatus.HALF_DAY;
        else status = AttendanceStatus.ABSENT;
      }

      let checkIn: Date | null = null;
      let checkOut: Date | null = null;
      let totalMinutes: number | null = null;

      if (
        status === AttendanceStatus.PRESENT ||
        status === AttendanceStatus.LATE
      ) {
        const startMin =
          status === AttendanceStatus.LATE ? 9 * 60 + 45 : 9 * 60 + 5;
        const endMin = 17 * 60 + 50;
        checkIn = addUtcMinutes(day, startMin);
        checkOut = addUtcMinutes(day, endMin);
        totalMinutes = endMin - startMin;
      } else if (status === AttendanceStatus.HALF_DAY) {
        checkIn = addUtcMinutes(day, 9 * 60 + 10);
        checkOut = addUtcMinutes(day, 13 * 60 + 10);
        totalMinutes = 4 * 60;
      }

      attendanceRows.push({
        employeeId: emp.id,
        date: day,
        checkIn,
        checkOut,
        totalMinutes,
        status,
        source: AttendanceSource.MANUAL,
      });
    }
  }

  await prisma.attendanceRecord.createMany({ data: attendanceRows });

  for (const L of leaveSeeds) {
    const emp = employees[L.employeeIndex];
    const startDate = dayDates[L.startOffset];
    const endDate = dayDates[L.endOffset];
    const totalDays = daysBetweenInclusiveUtc(startDate, endDate);
    const reviewedAt =
      L.status === LeaveStatus.APPROVED || L.status === LeaveStatus.REJECTED
        ? new Date(startDate.getTime() - 86400000)
        : null;

    await prisma.leaveRequest.create({
      data: {
        employeeId: emp.id,
        leaveType: L.type,
        startDate,
        endDate,
        totalDays,
        reason: L.reason,
        status: L.status,
        adminComment:
          L.status === LeaveStatus.REJECTED
            ? 'Peak season — please reschedule'
            : L.status === LeaveStatus.CANCELLED
              ? 'Cancelled by employee'
              : L.status === LeaveStatus.PENDING
                ? null
                : 'Approved. Enjoy your time off.',
        reviewedById: L.reviewedBy?.id ?? null,
        reviewedAt,
      },
    });
  }

  console.log('Seed completed.');
  console.log(
    `Users: ${3 + 3 + 30} (admins, managers, employees). Password for all: ${SEED_PASSWORD}`,
  );
  console.log(`Managers: ${managers.map((m) => m.email).join(', ')}`);
  console.log(
    `Shifts: ${shiftIds.length}, Attendance rows: ${attendanceRows.length}, Leave requests: ${leaveSeeds.length}`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
