# Employee Attendance System — Final Group Project Submission

## Course Information

| Field | Details |
|---|---|
| **Course** | Software Engineering Lab (Final Project) |
| **Program** | BSc in Computer Science and Engineering |
| **Institution** | [University Name] |
| **Semester** | Spring 2026 |
| **Submission Date** | April 2026 |

## Group Members

| # | Name | Student ID | Role |
|---|---|---|---|
| 1 | [Member 1 Name] | [ID] | [Role] |
| 2 | [Member 2 Name] | [ID] | [Role] |
| 3 | [Member 3 Name] | [ID] | [Role] |

---

## Project Overview

The **Employee Attendance System** is a web-based application that digitizes employee attendance tracking, leave management, shift scheduling, and reporting for organizations. It provides role-based access for **Admin** and **Employee** users.

### Key Features

- **Authentication**: Secure cookie-based JWT login with role-based access control
- **Attendance**: Daily check-in/check-out with automatic status tracking (Present, Late, Absent)
- **Leave Management**: Employee leave requests with admin approval/rejection workflow
- **Employee Management**: Admin CRUD operations on employee profiles
- **Shift Management**: Configurable work shifts with grace period settings
- **Reports**: Daily attendance KPI summary dashboard

### Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, React, TailwindCSS, shadcn/ui, Redux Toolkit Query |
| **Backend** | NestJS, Prisma ORM, TypeScript |
| **Database** | PostgreSQL 16 (via Docker) |
| **Authentication** | Cookie-based JWT with bcrypt password hashing |

### Software Process Model

This project followed an **Incremental / Agile-style** process:

1. **Increment 1** — Authentication and role-based access control
2. **Increment 2** — Employee and shift management
3. **Increment 3** — Attendance tracking and leave workflows
4. **Increment 4** — Reports, UI polish, and documentation

---

## Folder Structure

```
Final_Group_Project_Submission/
├── README.md                          ← This file
├── docs/
│   ├── SRS_Employee_Attendance_System.md    ← Full SRS Document
│   ├── Presentation_and_Demonstration.md    ← Presentation notes
│   ├── DIAGRAMS.md                          ← UML diagram documentation
│   ├── employee_attendance_use_case_diagram.svg   ← Use Case Diagram
│   ├── employee_attendance_class_diagram.svg      ← Class Diagram
│   ├── Employee_Attendance_Use_Case.drawio.html   ← Editable Use Case (draw.io)
│   ├── Employee_Attendance_Use_Case_Enhanced.drawio.html
│   └── Employee_Attendance_Class_Diagram.drawio.html ← Editable Class Diagram (draw.io)
└── code/
    ├── docker-compose.yml             ← PostgreSQL database container
    ├── backend/                       ← NestJS API server
    │   ├── .env.example               ← Environment variables template
    │   ├── prisma/
    │   │   ├── schema.prisma          ← Database schema
    │   │   ├── seed.ts                ← Seed data script
    │   │   └── migrations/            ← Database migration files
    │   └── src/                       ← Application source code
    │       ├── auth/                  ← Authentication module
    │       ├── users/                 ← User management
    │       ├── employees/             ← Employee CRUD
    │       ├── shifts/                ← Shift management
    │       ├── attendance/            ← Check-in/check-out
    │       ├── leave/                 ← Leave request workflow
    │       └── reports/               ← Report generation
    └── frontend/                      ← Next.js web application
        └── src/
            ├── app/                   ← Pages (login, dashboard, etc.)
            ├── components/ui/         ← Reusable UI components
            └── store/                 ← Redux API slices
```

---

## How to Run (Local Setup)

### Prerequisites

- **Node.js** 18+ installed
- **Docker Desktop** installed and running
- **npm** package manager

### Step 1: Start PostgreSQL Database

```bash
cd code
docker compose up -d
```

This starts a PostgreSQL 16 server on port `5432`.

### Step 2: Setup Backend (NestJS)

```bash
cd code/backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed the database with sample data (creates admin user + demo employees)
npm run db:seed

# Start the development server
npm run start:dev
```

Backend runs at **http://localhost:3001**

### Step 3: Setup Frontend (Next.js)

```bash
cd code/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at **http://localhost:3000**

### Step 4: Access the Application

Open **http://localhost:3000** in your browser.

---

## Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | (as set in `.env` → `SEED_ADMIN_EMAIL`) | (as set in `.env` → `SEED_ADMIN_PASSWORD`) |

Default values from `.env.example`:
- Email: `admin@example.com`
- Password: `Admin@123`

> **Note:** Change these credentials in `backend/.env` before running `npm run db:seed` if you want custom values.

---

## API Endpoints Summary

| Module | Endpoint | Method | Access |
|---|---|---|---|
| **Auth** | `/auth/login` | POST | Public |
| | `/auth/logout` | POST | Public |
| | `/auth/me` | GET | Authenticated |
| **Users** | `/users/me` | GET | Authenticated |
| | `/users` | GET | Admin only |
| **Employees** | `/employees` | GET, POST | Admin only |
| | `/employees/:id` | GET, PATCH | Admin only |
| **Shifts** | `/shifts` | GET, POST | Admin only |
| | `/shifts/:id` | GET, PATCH, DELETE | Admin only |
| **Attendance** | `/attendance/check-in` | POST | Employee |
| | `/attendance/check-out` | POST | Employee |
| | `/attendance/history` | GET | Employee |
| | `/attendance` | GET | Admin |
| **Leave** | `/leave` | GET, POST | Employee/Admin |
| | `/leave/:id/review` | PATCH | Admin only |
| **Reports** | `/reports/today-summary` | GET | Admin only |

---

## UML Diagrams

### Use Case Diagram
Shows the interaction between actors (Employee, Admin) and system use cases.
- File: `docs/employee_attendance_use_case_diagram.svg`
- Editable: `docs/Employee_Attendance_Use_Case_Enhanced.drawio.html` (open in draw.io)

### Class Diagram
Shows the system's class structure, attributes, methods, and relationships.
- File: `docs/employee_attendance_class_diagram.svg`
- Editable: `docs/Employee_Attendance_Class_Diagram.drawio.html` (open in draw.io)

---

## SRS Document

The complete Software Requirements Specification is located at:
- `docs/SRS_Employee_Attendance_System.md`

It includes:
- Functional and non-functional requirements (IEEE 830 format)
- Use case descriptions with stimulus/response
- Database schema requirements
- Requirement traceability matrix
- Data flow diagrams

---

## Presentation Guide

See `docs/Presentation_and_Demonstration.md` for:
- Project concept and objectives
- Key design decisions
- Live demo walkthrough steps
- Challenges faced and improvement suggestions

---

## Acknowledgment

AI assistants (such as Claude, ChatGPT, GitHub Copilot) were used for:
- Understanding implementation patterns
- Documentation support
- Minor development guidance

All final design choices, code integration, and project validation were performed by the team.
