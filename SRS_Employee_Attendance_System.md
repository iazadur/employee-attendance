# Software Requirements Specification (SRS)
## Employee Attendance System

---

| Field | Details |
|---|---|
| **Document Title** | Software Requirements Specification — Employee Attendance System |
| **Version** | 1.1 |
| **Course** | BSc in Computer Science and Engineering (CSE) |
| **Document Status** | Final |
| **Prepared By** | Md Azadur Rahman · Rakib Hossain · Aduri Akter |
| **Student IDs** | 4478 · 4056 · 4032 |
| **Roles** | Software Engineering · System Administration · QA Engineer |
| **Institution** | Department of Computer Science and Engineering |
| **Date** | April 2026 |
| **Live System** | http://attendance.azadur.com.bd/ |
| **Source Code** | https://github.com/iazadur/employee-attendance |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Purpose](#11-purpose)
   - 1.2 [Scope](#12-scope)
   - 1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   - 1.4 [References](#14-references)
   - 1.5 [Overview of Document](#15-overview-of-document)
2. [Overall Description](#2-overall-description)
   - 2.1 [Product Perspective](#21-product-perspective)
   - 2.2 [Product Functions](#22-product-functions)
   - 2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
   - 2.4 [Operating Environment](#24-operating-environment)
   - 2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
   - 2.6 [Assumptions and Dependencies](#26-assumptions-and-dependencies)
3. [System Features and Functional Requirements](#3-system-features-and-functional-requirements)
   - 3.1 [User Authentication and Authorization](#31-user-authentication-and-authorization)
   - 3.2 [Employee Management](#32-employee-management)
   - 3.3 [Attendance Management](#33-attendance-management)
   - 3.4 [Leave Management](#34-leave-management)
   - 3.5 [Shift Management](#35-shift-management)
   - 3.6 [Report Generation](#36-report-generation)
   - 3.7 [Dashboard and Analytics](#37-dashboard-and-analytics)
4. [External Interface Requirements](#4-external-interface-requirements)
   - 4.1 [User Interfaces](#41-user-interfaces)
   - 4.2 [Hardware Interfaces](#42-hardware-interfaces)
   - 4.3 [Software Interfaces](#43-software-interfaces)
   - 4.4 [Communication Interfaces](#44-communication-interfaces)
5. [Non-Functional Requirements](#5-non-functional-requirements)
   - 5.1 [Performance Requirements](#51-performance-requirements)
   - 5.2 [Security Requirements](#52-security-requirements)
   - 5.3 [Reliability Requirements](#53-reliability-requirements)
   - 5.4 [Availability Requirements](#54-availability-requirements)
   - 5.5 [Maintainability Requirements](#55-maintainability-requirements)
   - 5.6 [Scalability Requirements](#56-scalability-requirements)
   - 5.7 [Usability Requirements](#57-usability-requirements)
6. [System Models](#6-system-models)
   - 6.1 [Use Case Diagram Summary](#61-use-case-diagram-summary)
   - 6.2 [Class Diagram Summary](#62-class-diagram-summary)
   - 6.3 [Data Flow Overview](#63-data-flow-overview)
7. [Database Requirements](#7-database-requirements)
8. [Appendix](#8-appendix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document describes the complete functional and non-functional requirements for the **Employee Attendance System (EAS)**. The system automates and digitizes the process of tracking employee attendance, managing leaves, scheduling shifts, generating reports, and providing role-specific dashboards.

This document is intended for:
- Software developers and engineers responsible for implementation
- Project managers overseeing the development lifecycle
- University faculty and evaluators assessing the system design
- QA engineers responsible for testing and validation

### 1.2 Scope

The **Employee Attendance System** is a web-based, full-stack application built with Next.js (frontend) and NestJS (backend), backed by a PostgreSQL database managed through Prisma ORM.

**The system will:**
- Allow employees to mark their daily attendance (check-in and check-out) via the web interface
- Enable employees to apply for leave and track leave history
- Allow administrators and managers to manage employee records, approve or reject leave requests, assign shifts, and generate attendance reports
- Provide real-time role-specific dashboards with attendance KPIs and analytics
- Support three distinct user roles: Admin, Manager, and Employee

**The system will NOT:**
- Handle payroll processing or salary calculation (out of scope)
- Manage recruitment or onboarding processes
- Integrate with biometric hardware in this version (planned for v2.0)
- Support multi-organization tenancy in this version
- Provide SMS notifications (email/in-app only)

**Benefits:**
- Eliminates manual paper-based attendance registers
- Reduces administrative workload by 60–70%
- Provides accurate, real-time attendance data
- Ensures transparent leave management for all roles

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| **SRS** | Software Requirements Specification |
| **EAS** | Employee Attendance System |
| **Admin** | Administrator — full system access; manages employees, leaves, shifts, and reports |
| **Manager** | Supervisory role — can review attendance and leave requests for their team |
| **Employee** | A registered user who marks attendance and applies for leave |
| **Check-in** | Recording the start of a working day (web-based) |
| **Check-out** | Recording the end of a working day (web-based) |
| **Leave** | An authorized absence from work |
| **Shift** | A defined working time slot with start time, end time, and working days |
| **CUID** | Collision-resistant Unique Identifier — used as primary key format in this system |
| **JWT** | JSON Web Token — used for session authentication (stored in HTTP-only cookies) |
| **RBAC** | Role-Based Access Control |
| **ORM** | Object-Relational Mapper — Prisma is used in this system |
| **API** | Application Programming Interface (REST/JSON) |
| **CRUD** | Create, Read, Update, Delete |
| **HTTP-only Cookie** | A browser cookie inaccessible to JavaScript — used to store JWT tokens securely |
| **Grace Period** | Minutes after shift start within which a check-in is not counted as late |

### 1.4 References

- IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications
- NestJS Documentation — https://docs.nestjs.com
- Next.js Documentation — https://nextjs.org/docs
- Prisma ORM Documentation — https://www.prisma.io/docs
- Sommerville, I. (2016). *Software Engineering*, 10th Edition. Pearson
- ISO/IEC 25010:2011 — Systems and software Quality Requirements and Evaluation (SQuaRE)

### 1.5 Overview of Document

- **Section 2** — Overall description of the product, user roles, operating environment, and constraints.
- **Section 3** — All functional requirements organized by feature module.
- **Section 4** — External interface requirements (UI, hardware, software, communication).
- **Section 5** — Non-functional requirements: performance, security, scalability, etc.
- **Section 6** — System models: use case and class diagram summaries.
- **Section 7** — Database schema derived from the actual Prisma schema.
- **Section 8** — Appendix: glossary, traceability matrix, future work, revision history.

---

## 2. Overall Description

### 2.1 Product Perspective

The Employee Attendance System is a standalone, full-stack web application. It replaces traditional manual attendance registers and spreadsheet-based tracking with a real-time digital platform.

The system follows a three-tier architecture:

```
┌──────────────────────────────────────────────────┐
│               Presentation Layer                  │
│     Next.js 16 + React 19 (App Router, TypeScript)│
└─────────────────────┬────────────────────────────┘
                      │ HTTPS / REST (JSON)
┌─────────────────────▼────────────────────────────┐
│               Application Layer                   │
│      NestJS 11 (TypeScript, Passport JWT, RBAC)   │
└─────────────────────┬────────────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼────────────────────────────┐
│                  Data Layer                       │
│           PostgreSQL (via Prisma 5.x)             │
└──────────────────────────────────────────────────┘
```

The system is containerized with Docker and Docker Compose and deployed at **http://attendance.azadur.com.bd/**.

### 2.2 Product Functions

| # | Function | Description |
|---|---|---|
| F1 | User Authentication | Secure login/logout using JWT stored in HTTP-only cookies |
| F2 | Role-Based Access Control | Three roles (Admin, Manager, Employee) with guarded API routes |
| F3 | Employee Management | Add, update, activate/deactivate employee profiles with unique codes |
| F4 | Attendance Marking | Web-based check-in and check-out with automatic status classification |
| F5 | Attendance Viewing | View personal or team attendance history with date filters |
| F6 | Leave Application | Submit, track, and cancel leave requests |
| F7 | Leave Approval | Admin/Manager reviews and approves or rejects leave requests |
| F8 | Shift Management | Define shifts with start time, end time, working days, and grace period |
| F9 | Report Generation | Generate and filter monthly/weekly attendance summaries and charts |
| F10 | Dashboard | Real-time role-specific KPI overview of attendance statistics |

### 2.3 User Classes and Characteristics

The system supports three distinct user roles, stored as the `UserRole` enum in the database.

#### 2.3.1 Employee (`EMPLOYEE`)
- **Description:** Regular staff members who use the system daily to mark attendance and manage their leave
- **Technical Proficiency:** Basic computer literacy assumed
- **Frequency of Use:** Daily (attendance), occasionally (leave)
- **Access Level:** Own data only — check-in/out, own attendance history, own leave requests, own dashboard

#### 2.3.2 Manager (`MANAGER`)
- **Description:** Team supervisors who oversee their team's attendance and leave
- **Technical Proficiency:** Moderate computer literacy
- **Frequency of Use:** Daily
- **Access Level:** Can view team attendance, review leave requests, and manage shifts for their team

#### 2.3.3 Administrator (`ADMIN`)
- **Description:** HR personnel or system administrators who oversee the entire organization
- **Technical Proficiency:** Moderate computer literacy
- **Frequency of Use:** Daily
- **Access Level:** Full — manage all employees, approve leave, manage shifts, generate all reports, override attendance

### 2.4 Operating Environment

#### Client-Side Requirements
| Component | Requirement |
|---|---|
| **Web Browser** | Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+ |
| **Internet Connection** | Minimum 1 Mbps broadband |
| **Screen Resolution** | Minimum 1280 × 720 pixels |
| **Mobile Support** | Responsive design supported (portrait and landscape) |

#### Server-Side Requirements (Actual Deployment Stack)
| Component | Requirement |
|---|---|
| **Operating System** | Ubuntu 22.04 LTS (Docker host) |
| **Container Runtime** | Docker + Docker Compose |
| **Backend Runtime** | Node.js 20+ (NestJS 11 requirement) |
| **Frontend Runtime** | Node.js 20+ (Next.js 16 build) |
| **Database** | PostgreSQL 14+ |
| **RAM** | Minimum 2 GB (4 GB recommended) |
| **Storage** | Minimum 20 GB SSD |

### 2.5 Design and Implementation Constraints

- The system is implemented as a web application accessible through standard web browsers without any plugin installation
- All passwords are hashed using **bcrypt** before storage
- JWT tokens are stored exclusively in **HTTP-only cookies** — not in localStorage
- All API routes are protected by **NestJS Guards** enforcing RBAC
- The frontend uses **Next.js App Router** with server components by default
- Database schema changes are managed through **Prisma migration scripts** (`prisma migrate deploy`)
- The system is containerized via **Docker Compose**, with migrations running automatically on startup
- All primary keys use **CUID** format (string), not integer auto-increment
- Attendance records are unique per employee per date (enforced by a composite unique index)

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Every employee has a unique registered email address
- Administrators are responsible for onboarding new employees into the system
- Internet connectivity is available at the workplace for employees to mark attendance
- Employees mark attendance personally and not on behalf of others

**Dependencies:**
- PostgreSQL database server must be running and accessible
- Prisma Client must be generated (`prisma generate`) before the backend starts
- Accurate server-side time (UTC) is required for correct timestamp recording
- Docker and Docker Compose must be installed on the deployment host

---

## 3. System Features and Functional Requirements

> **Priority Scale:** High (H) = Must have | Medium (M) = Should have | Low (L) = Nice to have

---

### 3.1 User Authentication and Authorization

#### 3.1.1 Description
The system provides secure login and logout functionality with role-based access control. JWT tokens are issued on successful login and stored in HTTP-only cookies. All protected API endpoints are guarded by NestJS JWT + RBAC guards.

#### 3.1.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | The system shall allow users to log in using a registered email address and password | H |
| FR-1.2 | The system shall validate credentials against the bcrypt-hashed password in the database | H |
| FR-1.3 | The system shall issue a signed JWT token and set it in an HTTP-only cookie upon successful login | H |
| FR-1.4 | The system shall enforce role-based access control (`ADMIN`, `MANAGER`, `EMPLOYEE`) for all protected routes | H |
| FR-1.5 | The system shall provide a `/auth/me` endpoint to validate the current session and return user details | H |
| FR-1.6 | The system shall allow users to log out, which clears the HTTP-only cookie | H |
| FR-1.7 | The system shall lock an account (status: `LOCKED`) and prevent further login when flagged by an admin | M |
| FR-1.8 | The system shall allow administrators to activate or deactivate user accounts | H |

#### 3.1.3 Stimulus / Response

| Stimulus | System Response |
|---|---|
| User submits correct credentials | System validates, issues JWT in HTTP-only cookie, redirects to dashboard |
| User submits incorrect credentials | System returns 401 Unauthorized with an error message |
| User accesses a route without a valid token | System returns 401; frontend redirects to login |
| User accesses a route outside their role | System returns 403 Forbidden |
| User clicks "Logout" | System clears the cookie and redirects to login |

---

### 3.2 Employee Management

#### 3.2.1 Description
Administrators can create, view, update, and deactivate employee records. Each employee has a `User` account linked to an `Employee` profile containing organizational information.

#### 3.2.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | The system shall allow admins to add new employee profiles with required fields | H |
| FR-2.2 | The system shall assign a unique `employeeCode` to each employee upon creation | H |
| FR-2.3 | The system shall allow admins to update any employee's profile information | H |
| FR-2.4 | The system shall allow admins to deactivate an employee account (status: `INACTIVE`) | H |
| FR-2.5 | The system shall prevent inactive or locked employees from logging in | H |
| FR-2.6 | The system shall allow admins to search and list employees | H |
| FR-2.7 | The system shall allow admins to assign a shift to an employee | H |
| FR-2.8 | The system shall support an optional profile photo URL per employee | L |

#### 3.2.3 Employee Profile Data Fields

| Field | Type | Required | Description |
|---|---|---|---|
| id | String (CUID) | Auto | Unique system-generated identifier |
| employeeCode | String | Auto/Unique | Human-readable employee code |
| name | String | Yes | Employee's full name (from linked User) |
| email | String | Yes | Unique login email (from linked User) |
| phone | String | Yes | Primary contact number |
| department | String | Yes | Department the employee belongs to |
| designation | String | Yes | Job title / role |
| joinDate | DateTime | Yes | When the employee started |
| shiftId | String (FK) | Optional | Assigned working shift |
| status | Enum | Yes | ACTIVE / INACTIVE / LOCKED (from User) |
| profilePhoto | String (URL) | Optional | Profile image URL |

---

### 3.3 Attendance Management

#### 3.3.1 Description
The system provides web-based attendance marking. Each check-in and check-out is timestamped. The system automatically classifies the attendance status based on shift configuration. Manual overrides by admins are tracked with an audit trail.

#### 3.3.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | The system shall allow an employee to check in once per working day via the web interface | H |
| FR-3.2 | The system shall record the exact timestamp of each check-in and check-out | H |
| FR-3.3 | The system shall prevent duplicate attendance records for the same employee on the same date (unique constraint) | H |
| FR-3.4 | The system shall calculate total working time in minutes (`totalMinutes`) per day automatically | H |
| FR-3.5 | The system shall mark an employee as `LATE` if check-in is after shift start time + grace period | H |
| FR-3.6 | The system shall mark attendance as `HALF_DAY` if working minutes are less than 50% of shift duration | M |
| FR-3.7 | The system shall allow admins to manually create or override attendance records (`source: MANUAL`) | M |
| FR-3.8 | The system shall log the admin who performed a manual override (`overriddenById`) | M |
| FR-3.9 | The system shall allow employees to view their own attendance history with date filters | H |
| FR-3.10 | The system shall allow admins and managers to view attendance records of all or individual employees | H |

#### 3.3.3 Attendance Status Definitions

| Status | Definition |
|---|---|
| `PRESENT` | Employee checked in and out within valid shift hours |
| `LATE` | Employee checked in after shift start time + grace period |
| `ABSENT` | No check-in recorded for the working day |
| `HALF_DAY` | Working minutes less than half the shift duration |
| `ON_LEAVE` | Employee has an approved leave for that day |
| `HOLIDAY` | Day declared as an official holiday |

#### 3.3.4 Attendance Source

| Source | Description |
|---|---|
| `WEB` | Employee marked attendance via the web application (default) |
| `MANUAL` | Admin created or overrode the attendance record manually |

---

### 3.4 Leave Management

#### 3.4.1 Description
The system provides a complete leave management workflow. Employees submit leave requests; admins and managers review, approve, or reject them. Leave history is tracked per employee.

#### 3.4.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | The system shall allow employees to submit a leave request with start date, end date, leave type, and reason | H |
| FR-4.2 | The system shall calculate `totalDays` automatically based on start and end dates | H |
| FR-4.3 | The system shall allow admins/managers to approve or reject leave requests with an optional comment | H |
| FR-4.4 | The system shall record who reviewed the request (`reviewedById`) and when (`reviewedAt`) | H |
| FR-4.5 | The system shall allow employees to cancel a pending leave request | M |
| FR-4.6 | The system shall allow employees to view their full leave request history | H |
| FR-4.7 | The system shall allow admins to view all leave requests across all employees | H |

#### 4.3.3 Leave Types

| Leave Type | Description |
|---|---|
| `ANNUAL` | Paid yearly vacation leave |
| `SICK` | Leave due to illness |
| `CASUAL` | Short-notice leave for personal reasons |
| `MATERNITY` | Leave for female employees after childbirth |
| `PATERNITY` | Leave for male employees after childbirth |
| `UNPAID` | Leave without pay |

#### 3.4.4 Leave Status Lifecycle

```
Employee submits request  →  status: PENDING
        ↓
Admin / Manager reviews
        ↓
  ┌─────┴──────┐
APPROVED     REJECTED
  ↓               ↓
status:        status:
APPROVED      REJECTED
adminComment  adminComment
reviewedById  reviewedById
reviewedAt    reviewedAt

Employee may cancel PENDING request → status: CANCELLED
```

---

### 3.5 Shift Management

#### 3.5.1 Description
Administrators define work shifts and assign them to individual employees. Shifts determine the expected check-in/check-out times used for automatic status classification (LATE, HALF_DAY).

#### 3.5.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | The system shall allow admins to create shift profiles with name, start time, end time, working days, and grace period | H |
| FR-5.2 | The system shall allow admins to assign a shift to an individual employee | H |
| FR-5.3 | The system shall allow admins to update or delete shift profiles | M |
| FR-5.4 | The system shall support multiple shift types (e.g., Morning, Evening, Night) | M |
| FR-5.5 | The system shall use the assigned shift's configuration for late and working-hour calculations | H |
| FR-5.6 | The system shall allow an optional description field per shift | L |

#### 3.5.3 Shift Data Fields

| Field | Type | Description |
|---|---|---|
| id | String (CUID) | Unique shift identifier |
| name | String | Shift name (e.g., "Morning Shift") |
| startTime | String | Expected check-in time (e.g., "09:00") |
| endTime | String | Expected check-out time (e.g., "17:00") |
| workingDays | String | Comma-separated days (e.g., "Mon,Tue,Wed,Thu,Fri") |
| graceMinutes | Int | Minutes of tolerance before marking LATE (default: 15) |
| description | String? | Optional notes about the shift |

---

### 3.6 Report Generation

#### 3.6.1 Description
The system generates attendance reports filtered by date range, employee, or department, with chart visualizations for management review.

#### 3.6.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | The system shall generate individual employee attendance reports | H |
| FR-6.2 | The system shall generate monthly attendance summary reports | H |
| FR-6.3 | The system shall allow filtering reports by date range and employee | H |
| FR-6.4 | The system shall display graphical charts (bar/line) in the report dashboard | M |
| FR-6.5 | The system shall include late count, absent count, and leave count in reports | H |
| FR-6.6 | The system shall display attendance percentage per employee | M |

---

### 3.7 Dashboard and Analytics

#### 3.7.1 Description
The system provides a role-specific dashboard showing real-time attendance KPIs and summary information.

#### 3.7.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | The system shall display a personalized dashboard upon login based on the user's role | H |
| FR-7.2 | The admin/manager dashboard shall show total present, absent, late, and on-leave counts for today | H |
| FR-7.3 | The employee dashboard shall show the user's own attendance status for today | H |
| FR-7.4 | The admin dashboard shall show pending leave requests requiring action | H |
| FR-7.5 | The dashboard shall display a monthly attendance trend chart | M |
| FR-7.6 | The employee dashboard shall display their recent attendance history | H |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements
- The UI is responsive, supporting desktop (1280px+), tablet (768px–1279px), and mobile (320px–767px)
- Built with Next.js 16 App Router and React 19 Server Components
- Consistent design with clear error messages and client-side + server-side input validation
- Loading indicators displayed for async operations

#### 4.1.2 Implemented Screens

| Screen | Description |
|---|---|
| Login Page | Email/password form; redirects to role-appropriate dashboard |
| Dashboard | KPI overview cards — present, absent, late, leave counts; trend charts |
| Attendance Page | Check-in / check-out button with current timestamp; attendance history table |
| Employees Page | Searchable, paginated employee list; add/edit/deactivate actions |
| Leave Page | Leave request form; leave history with status badges; admin approve/reject actions |
| Shifts Page | Shift list; add/edit shift form with time and working days configuration |
| Reports Page | Filtered attendance table; bar/line chart visualizations; summary statistics |

### 4.2 Hardware Interfaces

The system does not directly interface with specialized hardware in version 1.0.
- Accessible on any device with a modern web browser and internet connection
- Supports standard keyboard, mouse, and touch input

> **Planned for v2.0:** Biometric scanner integration (fingerprint/facial recognition)

### 4.3 Software Interfaces

| Interface | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript | Presentation layer and UI |
| **Backend API** | NestJS 11, TypeScript | REST API server |
| **ORM** | Prisma 5.x | Database access and schema migrations |
| **Database** | PostgreSQL 14+ | Primary data persistence |
| **Authentication** | @nestjs/jwt, passport-jwt, bcrypt | JWT session management and password hashing |
| **HTTP Cookies** | cookie-parser | Secure HTTP-only cookie handling |
| **Validation** | class-validator, class-transformer | DTO validation in NestJS |
| **Container** | Docker, Docker Compose | Deployment and service orchestration |
| **Testing** | Jest, Supertest | Unit and integration testing |

### 4.4 Communication Interfaces

| Protocol | Usage |
|---|---|
| **HTTPS (TLS)** | All client-server communication in production |
| **HTTP** | Development environment |
| **REST / JSON** | API data exchange format between frontend and backend |
| **Cookie (HTTP-only)** | JWT token transport between browser and server |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID | Requirement |
|---|---|
| NFR-1.1 | The system shall respond to any API request within **500ms** under normal load |
| NFR-1.2 | Database queries shall be optimized using Prisma with appropriate indexes |
| NFR-1.3 | The Next.js frontend shall use code splitting and lazy loading to minimize initial load time |
| NFR-1.4 | Report generation for monthly data shall complete within **5 seconds** |

### 5.2 Security Requirements

| ID | Requirement |
|---|---|
| NFR-2.1 | All passwords shall be hashed using **bcrypt** before storage |
| NFR-2.2 | JWT tokens shall be stored exclusively in **HTTP-only cookies** (not localStorage) |
| NFR-2.3 | All API endpoints shall be protected by **NestJS JWT Guards** |
| NFR-2.4 | The system shall enforce **RBAC** — each role can only access permitted routes and data |
| NFR-2.5 | All user inputs shall be validated via **class-validator** DTOs on the backend |
| NFR-2.6 | The system shall not expose internal stack traces or error details to the client in production |
| NFR-2.7 | All data transmission shall use **HTTPS** in production |

### 5.3 Reliability Requirements

| ID | Requirement |
|---|---|
| NFR-3.1 | The system shall run **Prisma migrations automatically** on container startup |
| NFR-3.2 | Attendance records, once saved, shall be immutable without an explicit admin override (logged with `overriddenById`) |
| NFR-3.3 | No submitted data shall be lost in the event of a server restart (persisted in PostgreSQL) |

### 5.4 Availability Requirements

| ID | Requirement |
|---|---|
| NFR-4.1 | The system shall be available **24 hours a day, 7 days a week** |
| NFR-4.2 | The system shall display a user-friendly error page during unexpected downtime |
| NFR-4.3 | Docker Compose shall restart services automatically on failure (`restart: unless-stopped`) |

### 5.5 Maintainability Requirements

| ID | Requirement |
|---|---|
| NFR-5.1 | The backend shall follow **NestJS module architecture** — separate modules for auth, employees, attendance, leave, shifts, reports |
| NFR-5.2 | All database schema changes shall be managed via **Prisma migration scripts** under version control |
| NFR-5.3 | The codebase shall use **TypeScript** throughout (both frontend and backend) |
| NFR-5.4 | Unit tests shall be written using **Jest** for service layer business logic |
| NFR-5.5 | Integration tests shall use **Supertest** against the NestJS API |

### 5.6 Scalability Requirements

| ID | Requirement |
|---|---|
| NFR-6.1 | The stateless NestJS API design shall support **horizontal scaling** |
| NFR-6.2 | The database shall efficiently handle growing employee and attendance records |
| NFR-6.3 | The system shall use **Prisma connection pooling** to manage concurrent database access |

### 5.7 Usability Requirements

| ID | Requirement |
|---|---|
| NFR-7.1 | A new employee shall be able to complete the check-in process within **30 seconds** |
| NFR-7.2 | All error messages shall be in plain, user-friendly language |
| NFR-7.3 | The UI shall support **English** as the primary language |
| NFR-7.4 | The system shall display appropriate loading and empty states throughout the UI |

---

## 6. System Models

### 6.1 Use Case Diagram Summary

> See file: `attendance-use-case.drawio.pdf`

The system has three primary actors:

| Actor | Role |
|---|---|
| **Employee** | Marks attendance, views history, applies for and cancels leave |
| **Manager** | Views team attendance, reviews leave requests, manages shifts |
| **Admin** | Full system access — manages employees, approves leave, generates reports, overrides attendance |

**Key Use Cases:**

| Use Case | Actor(s) | Description |
|---|---|---|
| Login / Logout | All | Authenticate with email + password |
| Mark Attendance | Employee | Web-based check-in and check-out for the working day |
| View Attendance | Employee, Manager, Admin | View personal or team attendance records |
| Apply for Leave | Employee | Submit a leave request |
| Cancel Leave | Employee | Cancel a pending leave request |
| Approve / Reject Leave | Manager, Admin | Review and decide on leave requests |
| Manage Employees | Admin | CRUD operations on employee profiles |
| Assign Shift | Admin | Assign a shift profile to an employee |
| Manage Shifts | Admin, Manager | Create, update, view shift profiles |
| Generate Report | Admin, Manager | View attendance reports with charts |
| Override Attendance | Admin | Manually create or correct an attendance record |

**Relationships:**
- Approve / Reject Leave `«include»` Update Leave Status
- Mark Attendance `«include»` Classify Status (Present / Late / Half-Day)
- Override Attendance `«extend»` Mark Attendance

### 6.2 Class Diagram Summary

> See file: `attendance-class-diagram.drawio.pdf`

| Class | Type | Key Responsibilities |
|---|---|---|
| `User` | Concrete | Stores credentials, role, and account status; base identity entity |
| `Employee` | Concrete | Stores organizational profile; linked 1-to-1 with `User` |
| `Shift` | Concrete | Defines working hours, days, and grace period |
| `AttendanceRecord` | Concrete | Stores daily check-in/out per employee; tracks status and source |
| `LeaveRequest` | Concrete | Represents a leave application and its approval lifecycle |

**Key Relationships:**
- `User` has zero or one `Employee` (one-to-one, optional — admins may not have an Employee profile)
- `Employee` has many `AttendanceRecord` (one-to-many, cascade delete)
- `Employee` has many `LeaveRequest` (one-to-many, cascade delete)
- `Employee` is assigned one `Shift` (many-to-one, optional)
- `User` (Admin) reviews many `LeaveRequest` (one-to-many via `reviewedBy`)
- `User` (Admin) overrides many `AttendanceRecord` (one-to-many via `overriddenBy`)

### 6.3 Data Flow Overview

```
[Employee] ──check-in──► [Attendance Module]
                                │
                     classify status based on Shift
                                │
                         save AttendanceRecord
                                │
                    [PostgreSQL via Prisma ORM]

[Employee] ──leave request──► [Leave Module]
                                      │
                              validate & save
                              LeaveRequest (PENDING)
                                      │
                         [Admin / Manager reviews]
                                      │
                          ┌───────────┴────────────┐
                       APPROVED                  REJECTED
                          │                          │
                    update status              update status
                    record reviewer            record reviewer
                    mark attendance            notify result
                    ON_LEAVE for dates

[Admin] ──query──► [Report Module] ──► aggregated data ──► [Dashboard / Charts]
```

---

## 7. Database Requirements

The following schema is derived directly from the production Prisma schema (`backend/prisma/schema.prisma`).

---

### Table: `User`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (CUID) | PK | Unique user identifier |
| email | String | UNIQUE, NOT NULL | Login email |
| name | String | NOT NULL | Full name |
| passwordHash | String | NOT NULL | bcrypt-hashed password |
| role | Enum (UserRole) | NOT NULL, DEFAULT EMPLOYEE | ADMIN / MANAGER / EMPLOYEE |
| status | Enum (UserStatus) | NOT NULL, DEFAULT ACTIVE | ACTIVE / INACTIVE / LOCKED |
| createdAt | DateTime | NOT NULL, DEFAULT now() | Record creation timestamp |
| updatedAt | DateTime | NOT NULL, auto-update | Last modification timestamp |

---

### Table: `Employee`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (CUID) | PK | Unique employee record identifier |
| employeeCode | String | UNIQUE, NOT NULL | Human-readable code (e.g., EMP-0001) |
| department | String | NOT NULL | Department name |
| designation | String | NOT NULL | Job title |
| joinDate | DateTime | NOT NULL | Date of joining |
| phone | String | NOT NULL | Contact number |
| profilePhoto | String? | NULL | Optional profile image URL |
| userId | String | UNIQUE, FK → User | Linked user account (cascade delete) |
| shiftId | String? | FK → Shift, NULL | Assigned shift (optional) |
| createdAt | DateTime | NOT NULL | Record creation timestamp |
| updatedAt | DateTime | NOT NULL | Last modification timestamp |

---

### Table: `Shift`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (CUID) | PK | Unique shift identifier |
| name | String | NOT NULL | Shift name (e.g., "Morning Shift") |
| startTime | String | NOT NULL | Expected check-in time (e.g., "09:00") |
| endTime | String | NOT NULL | Expected check-out time (e.g., "17:00") |
| workingDays | String | NOT NULL | Comma-separated (e.g., "Mon,Tue,Wed,Thu,Fri") |
| graceMinutes | Int | NOT NULL, DEFAULT 15 | Tolerance before marking LATE |
| description | String? | NULL | Optional notes |
| createdAt | DateTime | NOT NULL | Record creation timestamp |
| updatedAt | DateTime | NOT NULL | Last modification timestamp |

---

### Table: `AttendanceRecord`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (CUID) | PK | Record identifier |
| employeeId | String | FK → Employee, NOT NULL | Employee reference (cascade delete) |
| date | DateTime | NOT NULL | Attendance date |
| checkIn | DateTime? | NULL | Check-in timestamp |
| checkOut | DateTime? | NULL | Check-out timestamp |
| totalMinutes | Int? | NULL | Calculated working time in minutes |
| status | Enum (AttendanceStatus) | NOT NULL | PRESENT / ABSENT / LATE / HALF_DAY / ON_LEAVE / HOLIDAY |
| source | Enum (AttendanceSource) | NOT NULL, DEFAULT WEB | WEB / MANUAL |
| isManualOverride | Boolean | DEFAULT false | True if admin modified this record |
| overriddenById | String? | FK → User, NULL | Admin who performed the override |
| createdAt | DateTime | NOT NULL | Record creation timestamp |
| updatedAt | DateTime | NOT NULL | Last modification timestamp |
| **UNIQUE** | (employeeId, date) | | Prevent duplicate entries per day |
| **INDEX** | date | | Optimized date-range queries |

---

### Table: `LeaveRequest`

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | String (CUID) | PK | Leave request identifier |
| employeeId | String | FK → Employee, NOT NULL | Applicant (cascade delete) |
| leaveType | Enum (LeaveType) | NOT NULL | ANNUAL / SICK / CASUAL / MATERNITY / PATERNITY / UNPAID |
| startDate | DateTime | NOT NULL | Leave start date |
| endDate | DateTime | NOT NULL | Leave end date |
| totalDays | Int | NOT NULL | Number of leave days requested |
| reason | String | NOT NULL | Reason for leave |
| status | Enum (LeaveStatus) | NOT NULL, DEFAULT PENDING | PENDING / APPROVED / REJECTED / CANCELLED |
| adminComment | String? | NULL | Optional reviewer feedback |
| reviewedById | String? | FK → User, NULL | Admin/Manager who reviewed |
| reviewedAt | DateTime? | NULL | Timestamp of the review decision |
| createdAt | DateTime | NOT NULL | Submission timestamp |
| updatedAt | DateTime | NOT NULL | Last modification timestamp |
| **INDEX** | (employeeId, status) | | Optimized status filter queries |

---

## 8. Appendix

### 8.1 Glossary of Additional Terms

| Term | Meaning |
|---|---|
| **CUID** | Collision-resistant Unique Identifier — a string-based ID format used as primary keys in this system |
| **Soft Delete** | Marking a record as `INACTIVE` rather than permanently removing it from the database |
| **HTTP-only Cookie** | A browser cookie that cannot be accessed via JavaScript, used here to store JWT tokens securely |
| **RBAC** | Role-Based Access Control — method of restricting access based on a user's assigned role |
| **Prisma** | A next-generation Node.js ORM providing type-safe database access and migration management |
| **NestJS Guard** | A NestJS class that determines whether a request is allowed to proceed based on authentication/authorization |
| **DTO** | Data Transfer Object — a class that defines the shape and validation rules for incoming request data |
| **Grace Period** | Minutes after shift start during which a check-in is not counted as late |
| **MANUAL override** | An attendance record created or modified by an Admin, logged with `source: MANUAL` and `isManualOverride: true` |

### 8.2 Requirement Traceability Matrix (RTM)

| Requirement ID | Feature | Priority | Implemented |
|---|---|---|---|
| FR-1.1 – FR-1.8 | Authentication & RBAC | H/M | Yes — NestJS JWT + Passport + Guards |
| FR-2.1 – FR-2.8 | Employee Management | H/M/L | Yes — `/employees` module |
| FR-3.1 – FR-3.10 | Attendance Management | H/M | Yes — `/attendance` module |
| FR-4.1 – FR-4.7 | Leave Management | H/M | Yes — `/leave` module |
| FR-5.1 – FR-5.6 | Shift Management | H/M/L | Yes — `/shifts` module |
| FR-6.1 – FR-6.6 | Report Generation | H/M | Yes — `/reports` module |
| FR-7.1 – FR-7.6 | Dashboard & Analytics | H/M | Yes — frontend dashboard page |
| NFR-1.x | Performance | H | Prisma indexes, Next.js code splitting |
| NFR-2.x | Security | H | bcrypt, HTTP-only JWT, RBAC guards |
| NFR-3.x | Reliability | H | Prisma migrations, unique constraints |
| NFR-4.x | Availability | H | Docker Compose auto-restart |
| NFR-5.x | Maintainability | M | TypeScript, modular NestJS, Prisma migrations |
| NFR-6.x | Scalability | M | Stateless API, connection pooling |
| NFR-7.x | Usability | M | Responsive Next.js UI |

### 8.3 Future Enhancements (Out of Scope for v1.0)

| Version | Feature |
|---|---|
| v2.0 | Biometric scanner integration (fingerprint / facial recognition) |
| v2.0 | Mobile application (React Native for Android & iOS) |
| v2.0 | GPS-based geo-fenced check-in for remote employees |
| v2.1 | Payroll system integration |
| v2.1 | Multi-organization / multi-branch tenancy support |
| v2.1 | Email and SMS notification system |
| v3.0 | AI-based attendance anomaly detection |
| v3.0 | Predictive analytics for absenteeism trends |

### 8.4 Document Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | January 2026 | Md Azadur Rahman | Initial draft created |
| 0.5 | February 2026 | Md Azadur Rahman, Rakib Hossain | Functional requirements expanded |
| 0.8 | March 2026 | Aduri Akter | Non-functional requirements added; QA review |
| 1.0 | March 2026 | Md Azadur Rahman | First submitted version |
| 1.1 | April 2026 | Md Azadur Rahman | Refactored to match actual implementation — updated tech stack (NestJS 11, Next.js 16, Prisma 5, PostgreSQL), three-role model (Admin/Manager/Employee), real Prisma schema, removed unimplemented features (notification table, leave balance table, OTP reset, CSV import) |

---

*End of Software Requirements Specification*

*Prepared by: Md Azadur Rahman (4478) · Rakib Hossain (4056) · Aduri Akter (4032)*
*Department of Computer Science and Engineering · April 2026*
*IEEE Std 830-1998 compliant — prepared for academic submission.*
