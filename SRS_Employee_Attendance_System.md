# Software Requirements Specification (SRS)
## Employee Attendance System

---

| Field | Details |
|---|---|
| **Document Title** | Software Requirements Specification — Employee Attendance System |
| **Version** | 1.0 |
| **Course** | BSc in Computer Science and Engineering (CSE) |
| **Document Status** | Final Draft |
| **Prepared By** | [Your Name] |
| **Student ID** | [Your Student ID] |
| **Institution** | [Your University Name] |
| **Department** | Department of Computer Science and Engineering |
| **Date** | March 2026 |

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
   - 3.7 [Notification System](#37-notification-system)
   - 3.8 [Dashboard and Analytics](#38-dashboard-and-analytics)
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

This Software Requirements Specification (SRS) document describes the complete functional and non-functional requirements for the **Employee Attendance System**. The system is designed to automate and digitize the process of tracking employee attendance, managing leaves, generating reports, and notifying stakeholders within an organization.

This document is intended for:
- Software developers and engineers responsible for implementation
- Project managers overseeing the development lifecycle
- University faculty and evaluators assessing the system design
- QA engineers responsible for testing and validation

### 1.2 Scope

The **Employee Attendance System** is a web-based application that enables organizations to manage employee attendance digitally and efficiently.

**The system will:**
- Allow employees to mark their daily attendance (check-in and check-out)
- Enable employees to apply for leave and track leave balances
- Allow administrators to manage employee records, approve or reject leave requests, assign shifts, and generate attendance reports
- Send automated email/SMS notifications for attendance events and leave approvals
- Provide a real-time dashboard with analytics and attendance summaries

**The system will NOT:**
- Handle payroll processing or salary calculation (out of scope)
- Manage recruitment or onboarding processes
- Integrate with biometric hardware in this version (planned for v2.0)
- Support multi-organization tenancy in this version

**Benefits:**
- Eliminates manual paper-based attendance registers
- Reduces administrative workload by 60–70%
- Provides accurate, real-time attendance data
- Ensures transparent leave management for both employees and management

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| **SRS** | Software Requirements Specification |
| **EAS** | Employee Attendance System |
| **Admin** | Administrator — a privileged user who manages the system |
| **Employee** | A registered user who marks attendance and applies for leave |
| **Check-in** | The act of recording the start of a work day |
| **Check-out** | The act of recording the end of a work day |
| **Leave** | An authorized absence from work |
| **Shift** | A defined working time slot assigned to an employee |
| **Report** | A generated summary of attendance data over a given period |
| **OTP** | One-Time Password — used for secure login verification |
| **JWT** | JSON Web Token — used for session authentication |
| **API** | Application Programming Interface |
| **UI** | User Interface |
| **DB** | Database |
| **HTTP/HTTPS** | HyperText Transfer Protocol / Secure |
| **CRUD** | Create, Read, Update, Delete |
| **RBAC** | Role-Based Access Control |

### 1.4 References

- IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications
- IEEE Std 1233-1998 — Guide for Developing System Requirements Specifications
- Sommerville, I. (2016). *Software Engineering*, 10th Edition. Pearson
- Pressman, R. S. (2014). *Software Engineering: A Practitioner's Approach*, 8th Edition. McGraw-Hill
- ISO/IEC 25010:2011 — Systems and software Quality Requirements and Evaluation (SQuaRE)

### 1.5 Overview of Document

The remainder of this document is organized as follows:

- **Section 2** provides an overall description of the product, including its perspective, key functions, types of users, and constraints.
- **Section 3** details all functional requirements organized by feature modules.
- **Section 4** describes external interface requirements including UI, hardware, software, and communication interfaces.
- **Section 5** specifies non-functional requirements such as performance, security, and scalability.
- **Section 6** provides system models including use case and class diagram summaries.
- **Section 7** covers database requirements and table schemas.
- **Section 8** contains the appendix with supplementary information.

---

## 2. Overall Description

### 2.1 Product Perspective

The Employee Attendance System is a standalone web-based application. It is designed as a new self-contained system and does not directly replace an existing automated system — rather, it replaces traditional manual attendance registers and spreadsheet-based tracking.

The system operates as a three-tier architecture:

```
┌─────────────────────────────────────────────┐
│              Presentation Layer              │
│          (Web Browser / Mobile UI)          │
└─────────────────────┬───────────────────────┘
                      │ HTTP/HTTPS
┌─────────────────────▼───────────────────────┐
│              Application Layer               │
│          (Backend Server / REST API)         │
└─────────────────────┬───────────────────────┘
                      │ SQL Queries
┌─────────────────────▼───────────────────────┐
│                 Data Layer                   │
│          (Relational Database Server)        │
└─────────────────────────────────────────────┘
```

The system interfaces with:
- Email servers (SMTP) for sending notifications
- SMS gateway APIs (optional, for SMS alerts)
- Web browsers as the primary client interface

### 2.2 Product Functions

The major functions of the Employee Attendance System are summarized below:

| # | Function | Description |
|---|---|---|
| F1 | User Authentication | Secure login/logout with role-based access control |
| F2 | Employee Management | Add, update, deactivate, and view employee profiles |
| F3 | Attendance Marking | Daily check-in and check-out with timestamps |
| F4 | Attendance Viewing | View personal or team attendance history |
| F5 | Leave Application | Submit, track, and cancel leave requests |
| F6 | Leave Approval | Admin reviews, approves, or rejects leave requests |
| F7 | Shift Management | Assign and manage work shifts for employees |
| F8 | Report Generation | Generate and export monthly/weekly attendance reports |
| F9 | Notification System | Automated alerts for attendance and leave events |
| F10 | Dashboard | Real-time overview of attendance statistics |

### 2.3 User Classes and Characteristics

The system supports three distinct user roles:

#### 2.3.1 Employee
- **Description:** Regular staff members who use the system daily to mark attendance and manage their leave
- **Technical Proficiency:** Basic computer/smartphone literacy assumed
- **Frequency of Use:** Daily (for attendance), occasionally (for leave management)
- **Access Level:** Limited — can only view and manage their own data
- **Key Activities:** Check-in, check-out, view attendance, apply for leave, view payslip, update profile

#### 2.3.2 Administrator (Admin)
- **Description:** HR managers or supervisors who oversee the entire system
- **Technical Proficiency:** Moderate computer literacy
- **Frequency of Use:** Daily
- **Access Level:** Full — can manage all employee data and system configurations
- **Key Activities:** Add/remove employees, approve leave, manage shifts, generate reports, send notifications

#### 2.3.3 System (Automated)
- **Description:** The system itself acts as an actor for automated tasks
- **Key Activities:** Send scheduled notifications, auto-mark absent if no check-in by cutoff time, generate scheduled reports

### 2.4 Operating Environment

#### Client-Side Requirements
| Component | Requirement |
|---|---|
| **Web Browser** | Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+ |
| **Internet Connection** | Minimum 1 Mbps broadband |
| **Screen Resolution** | Minimum 1280 × 720 pixels |
| **Mobile Support** | Responsive design for Android 8+ and iOS 13+ |

#### Server-Side Requirements
| Component | Requirement |
|---|---|
| **Operating System** | Ubuntu 20.04 LTS or Windows Server 2019 |
| **Web Server** | Apache 2.4+ or Nginx 1.18+ |
| **Runtime Environment** | Node.js 18+ (or Java 17 / Python 3.10+) |
| **Database** | MySQL 8.0+ or PostgreSQL 14+ |
| **RAM** | Minimum 4 GB (8 GB recommended) |
| **Storage** | Minimum 50 GB SSD |

### 2.5 Design and Implementation Constraints

- The system must be implemented as a web application accessible through standard web browsers without requiring any plugin installation
- All passwords must be stored using industry-standard hashing algorithms (bcrypt with salt)
- The system must comply with applicable data protection regulations
- Session tokens must expire after 8 hours of inactivity
- The system must use HTTPS for all data transmission
- The codebase must follow MVC (Model-View-Controller) architectural pattern
- The system must support at least 500 concurrent users without performance degradation
- All date and time values must be stored in UTC and displayed in the user's local timezone

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Every employee has a unique registered email address in the organization
- Administrators are responsible for onboarding new employees into the system
- The organization follows a standard working week (e.g., 5 or 6 days per week)
- Internet connectivity is available at the workplace for employees to mark attendance
- Employees are expected to mark attendance personally and not on behalf of others

**Dependencies:**
- The system depends on a functioning SMTP server for email notifications
- The system depends on a reliable database server for data persistence
- Accurate system time on the server is required for correct timestamp recording
- Third-party SMS gateway availability (for optional SMS notifications)

---

## 3. System Features and Functional Requirements

> **Priority Scale:** High (H) = Must have | Medium (M) = Should have | Low (L) = Nice to have

---

### 3.1 User Authentication and Authorization

#### 3.1.1 Description
The system shall provide secure login and logout functionality with role-based access control (RBAC) to ensure that each user can only access features and data appropriate to their role.

#### 3.1.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | The system shall allow users to log in using a registered email address and password | H |
| FR-1.2 | The system shall validate credentials against the stored hashed password | H |
| FR-1.3 | The system shall issue a JWT session token upon successful authentication | H |
| FR-1.4 | The system shall enforce role-based access control for all protected routes | H |
| FR-1.5 | The system shall allow users to reset their password via a registered email OTP | H |
| FR-1.6 | The system shall automatically log out a user after 8 hours of inactivity | M |
| FR-1.7 | The system shall lock an account after 5 consecutive failed login attempts for 15 minutes | M |
| FR-1.8 | The system shall allow administrators to manually unlock locked accounts | M |
| FR-1.9 | The system shall maintain an audit log of all login and logout events | M |
| FR-1.10 | The system shall support "Remember Me" functionality for trusted devices | L |

#### 3.1.3 Stimulus / Response

| Stimulus | System Response |
|---|---|
| User submits correct credentials | System validates, issues JWT, redirects to dashboard |
| User submits incorrect credentials | System displays error message; increments failed attempt counter |
| 5 failed attempts | Account temporarily locked; admin notified via email |
| User clicks "Forgot Password" | System sends OTP to registered email within 2 minutes |
| Session expires | System invalidates token; redirects user to login page |

---

### 3.2 Employee Management

#### 3.2.1 Description
Administrators shall be able to create, view, update, and deactivate employee records. Each employee shall have a unique profile containing personal and organizational information.

#### 3.2.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | The system shall allow admins to add new employee profiles with required fields | H |
| FR-2.2 | The system shall automatically generate a unique Employee ID upon registration | H |
| FR-2.3 | The system shall allow admins to update any employee's profile information | H |
| FR-2.4 | The system shall allow admins to deactivate (soft-delete) an employee account | H |
| FR-2.5 | The system shall prevent deactivated employees from logging in | H |
| FR-2.6 | The system shall allow admins to search employees by name, ID, or department | H |
| FR-2.7 | The system shall allow employees to update their own contact details and profile photo | M |
| FR-2.8 | The system shall store the date of joining and department for each employee | H |
| FR-2.9 | The system shall support bulk import of employee data via CSV file | M |
| FR-2.10 | The system shall display a full list of active employees with pagination | M |

#### 3.2.3 Employee Profile Data Fields

| Field | Type | Required | Description |
|---|---|---|---|
| Employee ID | String (Auto) | Yes | Unique system-generated identifier |
| Full Name | String | Yes | Employee's legal full name |
| Email Address | String | Yes | Unique, used for login |
| Phone Number | String | Yes | Primary contact number |
| Department | String | Yes | Department the employee belongs to |
| Designation | String | Yes | Job title / role |
| Date of Joining | Date | Yes | When the employee started |
| Shift | FK Reference | Yes | Assigned working shift |
| Status | Enum | Yes | Active / Inactive |
| Profile Photo | Image URL | No | Optional profile picture |

---

### 3.3 Attendance Management

#### 3.3.1 Description
The system shall provide functionality for employees to mark their daily attendance. Each check-in and check-out event must be timestamped and stored. The system must also track attendance status (Present, Absent, Late, Half-Day).

#### 3.3.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | The system shall allow an employee to check in once per working day | H |
| FR-3.2 | The system shall record the exact timestamp of each check-in and check-out | H |
| FR-3.3 | The system shall prevent an employee from checking in twice on the same day | H |
| FR-3.4 | The system shall calculate total working hours per day automatically | H |
| FR-3.5 | The system shall mark an employee as "Late" if check-in is after the shift start time | H |
| FR-3.6 | The system shall automatically mark an employee as "Absent" if no check-in is recorded by end of shift | H |
| FR-3.7 | The system shall allow admins to manually correct or override attendance records | M |
| FR-3.8 | The system shall allow employees to view their attendance history with date filters | H |
| FR-3.9 | The system shall allow admins to view attendance records of all or individual employees | H |
| FR-3.10 | The system shall calculate and display monthly attendance percentage per employee | M |
| FR-3.11 | The system shall mark attendance as "Half-Day" if working hours are less than 50% of shift duration | M |

#### 3.3.3 Attendance Status Definitions

| Status | Definition |
|---|---|
| **Present** | Employee checked in and out within valid shift hours |
| **Late** | Employee checked in after the designated shift start time |
| **Absent** | No check-in recorded for the working day |
| **Half-Day** | Working hours less than half the shift duration |
| **On Leave** | Employee has an approved leave for that day |
| **Holiday** | Day declared as an official holiday |

---

### 3.4 Leave Management

#### 3.4.1 Description
The system shall provide a complete leave management workflow, allowing employees to apply for leave, and administrators to approve or reject those requests. Leave balances must be tracked automatically.

#### 3.4.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | The system shall allow employees to submit a leave request with start date, end date, leave type, and reason | H |
| FR-4.2 | The system shall display the employee's remaining leave balance before submission | H |
| FR-4.3 | The system shall prevent employees from applying for leave if balance is insufficient | H |
| FR-4.4 | The system shall notify the admin via email/notification when a leave request is submitted | H |
| FR-4.5 | The system shall allow admins to approve or reject leave requests with an optional comment | H |
| FR-4.6 | The system shall notify the employee of the admin's decision via email/notification | H |
| FR-4.7 | The system shall automatically deduct approved leave days from the employee's leave balance | H |
| FR-4.8 | The system shall allow employees to cancel a pending leave request | M |
| FR-4.9 | The system shall prevent leave requests for past dates | M |
| FR-4.10 | The system shall allow admins to configure leave types and annual leave quotas | M |
| FR-4.11 | The system shall track leave history for each employee | H |
| FR-4.12 | The system shall mark attendance as "On Leave" for approved leave days | H |

#### 3.4.3 Leave Types

| Leave Type | Description | Default Days/Year |
|---|---|---|
| Annual Leave | Paid yearly vacation leave | 20 days |
| Sick Leave | Leave due to illness (medical certificate may be required) | 14 days |
| Casual Leave | Short-notice leave for personal reasons | 10 days |
| Maternity Leave | Leave for female employees after childbirth | 112 days |
| Paternity Leave | Leave for male employees after childbirth | 7 days |
| Unpaid Leave | Leave without pay | As approved |

#### 3.4.4 Leave Workflow

```
Employee submits request
        ↓
System validates (balance check, date validation)
        ↓
Admin receives notification
        ↓
Admin reviews request
        ↓
  ┌─────┴─────┐
Approved    Rejected
  ↓              ↓
Balance        Employee
deducted    notified with
Attendance   rejection
updated      reason
  ↓
Employee
notified
```

---

### 3.5 Shift Management

#### 3.5.1 Description
The system shall allow administrators to define work shifts and assign them to individual employees or departments. Shifts determine the expected check-in/check-out times used for calculating late arrivals and absences.

#### 3.5.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | The system shall allow admins to create shift profiles with name, start time, end time, and working days | H |
| FR-5.2 | The system shall allow admins to assign a shift to an individual employee or a whole department | H |
| FR-5.3 | The system shall allow admins to update or delete shift profiles | M |
| FR-5.4 | The system shall support multiple shift types (e.g., Morning, Evening, Night) | M |
| FR-5.5 | The system shall use the assigned shift's start/end times for late and overtime calculations | H |
| FR-5.6 | The system shall allow admins to view all shift assignments in a schedule view | M |
| FR-5.7 | The system shall notify employees when their shift is changed | M |

---

### 3.6 Report Generation

#### 3.6.1 Description
The system shall generate comprehensive attendance reports that can be filtered by date range, department, or employee, and exported in multiple formats.

#### 3.6.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | The system shall generate individual employee attendance reports | H |
| FR-6.2 | The system shall generate department-wise attendance summary reports | H |
| FR-6.3 | The system shall generate monthly attendance summary reports for all employees | H |
| FR-6.4 | The system shall allow filtering reports by date range, employee, and department | H |
| FR-6.5 | The system shall allow exporting reports in PDF format | H |
| FR-6.6 | The system shall allow exporting reports in Excel (XLSX) format | M |
| FR-6.7 | The system shall allow printing reports directly from the browser | M |
| FR-6.8 | The system shall allow scheduling automatic monthly reports via email | L |
| FR-6.9 | The system shall display graphical charts (bar/pie) in the report dashboard | M |
| FR-6.10 | The system shall include late count, absent count, and leave count in reports | H |

#### 3.6.3 Report Types

| Report | Contents | Audience |
|---|---|---|
| Daily Attendance Report | All employee check-in/out for a given day | Admin |
| Monthly Summary Report | Attendance days, absences, leaves per employee | Admin, HR |
| Individual Employee Report | Full attendance history for one employee | Admin, Employee |
| Department Report | Aggregated attendance data per department | Admin |
| Leave Summary Report | All leave requests and statuses | Admin |

---

### 3.7 Notification System

#### 3.7.1 Description
The system shall automatically send notifications to employees and administrators for key attendance and leave events via email and in-app alerts.

#### 3.7.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | The system shall send an email confirmation to an employee upon successful check-in | M |
| FR-7.2 | The system shall notify an admin when an employee is marked absent | M |
| FR-7.3 | The system shall notify an admin when a leave request is submitted | H |
| FR-7.4 | The system shall notify an employee when their leave request is approved or rejected | H |
| FR-7.5 | The system shall display in-app notifications in real time | H |
| FR-7.6 | The system shall allow users to mark notifications as read | M |
| FR-7.7 | The system shall allow users to view their full notification history | M |
| FR-7.8 | The system shall send a reminder to employees who have not checked in 30 minutes after shift start | L |
| FR-7.9 | The system shall notify employees when their shift is updated by an admin | M |

---

### 3.8 Dashboard and Analytics

#### 3.8.1 Description
The system shall provide a role-specific dashboard that presents real-time attendance statistics and summary information in a visual and easy-to-understand format.

#### 3.8.2 Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-8.1 | The system shall display a personalized dashboard upon login based on the user's role | H |
| FR-8.2 | The admin dashboard shall show total present, absent, and on-leave counts for today | H |
| FR-8.3 | The employee dashboard shall show the user's attendance status for today | H |
| FR-8.4 | The admin dashboard shall show pending leave requests requiring action | H |
| FR-8.5 | The dashboard shall display a monthly attendance trend chart | M |
| FR-8.6 | The employee dashboard shall display remaining leave balance | H |
| FR-8.7 | The admin dashboard shall display department-wise attendance breakdown | M |
| FR-8.8 | The dashboard data shall refresh automatically every 5 minutes | M |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements
- The UI shall be responsive and support desktop (1280px+), tablet (768px–1279px), and mobile (320px–767px) screen sizes
- The system shall use a clean, professional design with consistent typography and color scheme
- The system shall provide clear error messages in plain language for all invalid inputs
- All forms shall include client-side and server-side input validation
- The system shall display a loading indicator for operations taking longer than 1 second

#### 4.1.2 Key Screens

| Screen | Description |
|---|---|
| Login Page | Email/password form with "Forgot Password" link |
| Employee Dashboard | Today's status, attendance summary, leave balance, notifications |
| Admin Dashboard | Overview cards, today's attendance, pending leaves, recent activity |
| Mark Attendance | Check-in / check-out button with current timestamp display |
| Attendance History | Filterable table of past attendance records |
| Leave Application Form | Date pickers, leave type dropdown, reason textarea |
| Leave Management | Admin view of all leave requests with approve/reject actions |
| Employee List | Searchable, paginated table of all employees |
| Report Page | Filter controls, table/chart view, export buttons |
| Notification Panel | List of notifications with read/unread status |

### 4.2 Hardware Interfaces

The system does not directly interface with specialized hardware in version 1.0. However, the system shall:
- Be accessible on any device with a modern web browser and internet connection
- Support standard keyboard and mouse input on desktop devices
- Support touch input on mobile and tablet devices
- Be compatible with standard network printers for report printing

> **Planned for v2.0:** Biometric scanner integration (fingerprint/facial recognition) via dedicated hardware API

### 4.3 Software Interfaces

| Interface | Purpose | Details |
|---|---|---|
| **MySQL / PostgreSQL** | Primary data persistence | JDBC / native driver connection |
| **SMTP Server** | Email notification delivery | Standard SMTP protocol, port 587 (TLS) |
| **REST API** | Frontend-backend communication | JSON over HTTP/HTTPS |
| **PDF Library** | Report export to PDF | e.g., PDFKit, iText, or jsPDF |
| **XLSX Library** | Report export to Excel | e.g., Apache POI or SheetJS |
| **JWT Library** | Session token management | e.g., jsonwebtoken (Node.js) |
| **BCrypt** | Password hashing | Cost factor ≥ 12 |

### 4.4 Communication Interfaces

| Protocol | Usage |
|---|---|
| **HTTPS (TLS 1.2+)** | All client-server communication |
| **SMTP (Port 587)** | Outgoing email notifications |
| **WebSocket (Optional)** | Real-time in-app notification push |
| **REST / JSON** | API data exchange format |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID | Requirement |
|---|---|
| NFR-1.1 | The system shall respond to any user request within **2 seconds** under normal load |
| NFR-1.2 | The system shall support at least **500 concurrent users** without performance degradation |
| NFR-1.3 | Report generation for monthly data shall complete within **5 seconds** |
| NFR-1.4 | Database queries shall be optimized with indexes to respond in under **500ms** |
| NFR-1.5 | The system shall handle attendance marking for **200 simultaneous check-ins** without failure |

### 5.2 Security Requirements

| ID | Requirement |
|---|---|
| NFR-2.1 | All passwords shall be hashed using **bcrypt** with a minimum cost factor of 12 |
| NFR-2.2 | All data transmission shall be encrypted using **TLS 1.2 or higher** (HTTPS) |
| NFR-2.3 | The system shall implement **JWT tokens** with a 24-hour expiry for session management |
| NFR-2.4 | The system shall enforce **Role-Based Access Control (RBAC)** for all API endpoints |
| NFR-2.5 | The system shall sanitize all user inputs to prevent **SQL injection** attacks |
| NFR-2.6 | The system shall implement **CSRF protection** on all state-changing operations |
| NFR-2.7 | The system shall implement **rate limiting** — max 100 requests per minute per IP |
| NFR-2.8 | The system shall maintain a complete **audit log** of all critical administrative actions |
| NFR-2.9 | Sensitive employee data shall be accessible only to authorized roles |
| NFR-2.10 | The system shall not expose internal stack traces or error details to the client |

### 5.3 Reliability Requirements

| ID | Requirement |
|---|---|
| NFR-3.1 | The system shall have a target uptime of **99.5%** per month |
| NFR-3.2 | The system shall perform **automated daily database backups** with 30-day retention |
| NFR-3.3 | The system shall recover from a server crash and restore full service within **30 minutes** |
| NFR-3.4 | No data submitted by users shall be lost in the event of a system failure |
| NFR-3.5 | Attendance records, once saved, shall be immutable without an explicit admin override log entry |

### 5.4 Availability Requirements

| ID | Requirement |
|---|---|
| NFR-4.1 | The system shall be available **24 hours a day, 7 days a week** |
| NFR-4.2 | Scheduled maintenance windows shall not exceed **2 hours per month** and shall be communicated 48 hours in advance |
| NFR-4.3 | The system shall display a user-friendly maintenance page during downtime |

### 5.5 Maintainability Requirements

| ID | Requirement |
|---|---|
| NFR-5.1 | The codebase shall follow the **MVC design pattern** for clear separation of concerns |
| NFR-5.2 | All code shall include inline comments and follow standard naming conventions |
| NFR-5.3 | The system shall provide a comprehensive **API documentation** (e.g., Swagger/OpenAPI) |
| NFR-5.4 | Database schema changes shall be managed via **version-controlled migration scripts** |
| NFR-5.5 | Unit tests shall cover at least **70%** of the business logic codebase |

### 5.6 Scalability Requirements

| ID | Requirement |
|---|---|
| NFR-6.1 | The system architecture shall support **horizontal scaling** (adding more server instances) |
| NFR-6.2 | The database shall be designed to efficiently handle up to **10,000 employee records** |
| NFR-6.3 | The system shall support storing **5+ years of attendance history** without performance loss |
| NFR-6.4 | The system shall use **database connection pooling** to manage high concurrent access |

### 5.7 Usability Requirements

| ID | Requirement |
|---|---|
| NFR-7.1 | A new employee shall be able to complete the check-in process within **30 seconds** of first use |
| NFR-7.2 | The UI shall follow **WCAG 2.1 Level AA** accessibility guidelines |
| NFR-7.3 | All error messages shall be in plain, user-friendly language with suggested corrective actions |
| NFR-7.4 | The system shall support **English** as the primary language |
| NFR-7.5 | The system shall provide **tooltips and help text** for all complex form fields |

---

## 6. System Models

### 6.1 Use Case Diagram Summary

The system has three primary actors:

| Actor | Role |
|---|---|
| **Employee** | Marks attendance, views history, applies for and manages leave |
| **Admin** | Manages employees, approves leave, generates reports, manages shifts |
| **System** | Sends automated notifications, auto-marks absent employees |

**Key Use Cases:**

| Use Case | Actor(s) | Description |
|---|---|---|
| Mark Attendance | Employee | Check-in and check-out for the working day |
| View Attendance | Employee, Admin | View personal or team attendance records |
| Apply for Leave | Employee | Submit a leave request to admin |
| Approve / Reject Leave | Admin | Review and decide on leave requests |
| Manage Employees | Admin | CRUD operations on employee profiles |
| Generate Report | Admin | Create and export attendance reports |
| Send Notification | System | Automated alerts to relevant users |

**Relationships:**
- Mark Attendance `«include»` Send Notification
- Approve / Reject Leave `«include»` Send Notification

### 6.2 Class Diagram Summary

The system is modeled with the following primary classes:

| Class | Type | Key Responsibilities |
|---|---|---|
| `Person` | Abstract | Base class for all users; holds common identity attributes |
| `Employee` | Concrete | Marks attendance, applies for leave, views data |
| `Admin` | Concrete | Manages system, approves leave, generates reports |
| `Attendance` | Concrete | Stores daily check-in/out records per employee |
| `LeaveRequest` | Concrete | Represents a single leave application and its lifecycle |
| `Shift` | Concrete | Defines working hours and days assigned to employees |
| `Report` | Concrete | Generated attendance summary data |
| `Notification` | Concrete | In-app and email alert records |

**Key Relationships:**
- `Employee` and `Admin` inherit from `Person` (Generalization)
- `Employee` has many `Attendance` records (Composition, 1 to *)
- `Employee` has many `LeaveRequest` records (Composition, 1 to *)
- `Admin` generates `Report` (Composition)
- `Admin` approves/rejects `LeaveRequest` (Dependency)
- `Employee` receives `Notification` (Association)
- `Employee` is assigned a `Shift` (Association)

### 6.3 Data Flow Overview

```
[Employee] ──check-in──► [Attendance Module] ──saves──► [Database]
                                  │
                           [Notification] ──email──► [Employee]
                                  │
                           [Report Module] ◄──query── [Admin]
                                  │
                           [PDF/XLSX Export] ──► [Admin]

[Employee] ──leave request──► [Leave Module] ──notifies──► [Admin]
                                                    │
                                            [Approve/Reject]
                                                    │
                                    ┌───────────────┘
                             ┌──────▼──────┐
                         Approved        Rejected
                             │               │
                      Balance update    Notification
                      Attendance mark   to Employee
                      Notification
                      to Employee
```

---

## 7. Database Requirements

### 7.1 Entity Descriptions

The system requires the following primary database tables:

#### Table: `users`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| user_id | VARCHAR(20) | PK, NOT NULL | Unique user identifier |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(150) | UNIQUE, NOT NULL | Login email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| role | ENUM | NOT NULL | 'employee' or 'admin' |
| status | ENUM | NOT NULL | 'active' or 'inactive' |
| created_at | DATETIME | NOT NULL | Record creation timestamp |

#### Table: `employees`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| employee_id | VARCHAR(20) | PK, FK(users) | Employee identifier |
| department | VARCHAR(100) | NOT NULL | Department name |
| designation | VARCHAR(100) | NOT NULL | Job title |
| shift_id | INT | FK(shifts) | Assigned shift |
| date_of_joining | DATE | NOT NULL | Joining date |
| phone | VARCHAR(20) | NOT NULL | Contact number |
| profile_photo | VARCHAR(255) | NULL | Profile image URL |

#### Table: `attendance`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| attendance_id | INT | PK, AUTO_INCREMENT | Record identifier |
| employee_id | VARCHAR(20) | FK(employees), NOT NULL | Employee reference |
| date | DATE | NOT NULL | Attendance date |
| check_in_time | DATETIME | NULL | Check-in timestamp |
| check_out_time | DATETIME | NULL | Check-out timestamp |
| total_hours | DECIMAL(5,2) | NULL | Calculated working hours |
| status | ENUM | NOT NULL | Present/Absent/Late/Half-Day/On Leave/Holiday |
| is_manual_override | BOOLEAN | DEFAULT FALSE | Admin override flag |
| override_by | VARCHAR(20) | FK(users), NULL | Admin who modified |
| UNIQUE | (employee_id, date) | | Prevent duplicate entries |

#### Table: `leave_requests`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| leave_id | INT | PK, AUTO_INCREMENT | Leave request identifier |
| employee_id | VARCHAR(20) | FK(employees), NOT NULL | Applicant |
| leave_type | ENUM | NOT NULL | Annual/Sick/Casual/etc. |
| start_date | DATE | NOT NULL | Leave start date |
| end_date | DATE | NOT NULL | Leave end date |
| total_days | INT | NOT NULL | Number of leave days |
| reason | TEXT | NOT NULL | Reason for leave |
| status | ENUM | NOT NULL | Pending/Approved/Rejected/Cancelled |
| admin_comment | TEXT | NULL | Admin feedback |
| reviewed_by | VARCHAR(20) | FK(users), NULL | Admin who reviewed |
| created_at | DATETIME | NOT NULL | Submission timestamp |
| reviewed_at | DATETIME | NULL | Review timestamp |

#### Table: `shifts`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| shift_id | INT | PK, AUTO_INCREMENT | Shift identifier |
| shift_name | VARCHAR(50) | NOT NULL | e.g., "Morning Shift" |
| start_time | TIME | NOT NULL | Expected check-in time |
| end_time | TIME | NOT NULL | Expected check-out time |
| working_days | VARCHAR(50) | NOT NULL | e.g., "Mon,Tue,Wed,Thu,Fri" |
| grace_minutes | INT | DEFAULT 15 | Late threshold in minutes |

#### Table: `notifications`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| notif_id | INT | PK, AUTO_INCREMENT | Notification identifier |
| user_id | VARCHAR(20) | FK(users), NOT NULL | Target user |
| message | TEXT | NOT NULL | Notification content |
| type | ENUM | NOT NULL | Info/Success/Warning/Alert |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| created_at | DATETIME | NOT NULL | Creation timestamp |

#### Table: `leave_balance`
| Column | Data Type | Constraints | Description |
|---|---|---|---|
| balance_id | INT | PK, AUTO_INCREMENT | Balance record identifier |
| employee_id | VARCHAR(20) | FK(employees), NOT NULL | Employee |
| leave_type | ENUM | NOT NULL | Leave type |
| year | YEAR | NOT NULL | Fiscal year |
| total_days | INT | NOT NULL | Annual entitlement |
| used_days | INT | DEFAULT 0 | Days used so far |
| remaining_days | INT (computed) | — | total_days - used_days |
| UNIQUE | (employee_id, leave_type, year) | | One record per type per year |

---

## 8. Appendix

### 8.1 Glossary of Additional Terms

| Term | Meaning |
|---|---|
| **Soft Delete** | Marking a record as inactive rather than permanently removing it from the database |
| **JWT** | JSON Web Token — a compact, self-contained way to securely transmit user identity information |
| **RBAC** | Role-Based Access Control — a method of regulating access based on user roles |
| **CRUD** | Create, Read, Update, Delete — the four basic operations of persistent data |
| **SMTP** | Simple Mail Transfer Protocol — used for sending emails |
| **TLS** | Transport Layer Security — a cryptographic protocol for secure communication |
| **REST API** | Representational State Transfer API — an architectural style for web APIs |
| **MVC** | Model-View-Controller — a software design pattern for web applications |
| **Grace Period** | A short time window after shift start within which late check-in is still allowed |

### 8.2 Requirement Traceability Matrix (RTM)

| Requirement ID | Feature | Priority | Source |
|---|---|---|---|
| FR-1.1 – FR-1.10 | Authentication | H/M/L | Stakeholder interview |
| FR-2.1 – FR-2.10 | Employee Management | H/M | Stakeholder interview |
| FR-3.1 – FR-3.11 | Attendance Management | H/M | Core system function |
| FR-4.1 – FR-4.12 | Leave Management | H/M | HR process requirement |
| FR-5.1 – FR-5.7 | Shift Management | H/M | Stakeholder interview |
| FR-6.1 – FR-6.10 | Report Generation | H/M/L | Management requirement |
| FR-7.1 – FR-7.9 | Notification System | H/M/L | User experience requirement |
| FR-8.1 – FR-8.8 | Dashboard | H/M | Usability requirement |
| NFR-1.x | Performance | H | System quality standard |
| NFR-2.x | Security | H | Industry best practice |
| NFR-3.x – 4.x | Reliability / Availability | H | Operational requirement |
| NFR-5.x – 6.x | Maintainability / Scalability | M | Long-term requirement |
| NFR-7.x | Usability | M | User experience standard |

### 8.3 Future Enhancements (Out of Scope for v1.0)

The following features are identified as potential enhancements for future versions:

| Version | Feature |
|---|---|
| v2.0 | Biometric scanner integration (fingerprint / facial recognition) |
| v2.0 | Mobile application (Android & iOS native apps) |
| v2.0 | GPS-based location verification for remote employees |
| v2.1 | Payroll system integration |
| v2.1 | Multi-organization / multi-branch support |
| v3.0 | AI-based attendance anomaly detection |
| v3.0 | Predictive analytics for absenteeism trends |

### 8.4 Document Revision History

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | January 2026 | [Author Name] | Initial draft created |
| 0.5 | February 2026 | [Author Name] | Functional requirements expanded |
| 0.8 | March 2026 | [Author Name] | Non-functional requirements added |
| 1.0 | March 2026 | [Author Name] | Final version submitted |

---

*End of Software Requirements Specification*

*Document prepared in accordance with IEEE Std 830-1998 for academic submission.*
*© 2026 — [Your University Name] — Department of Computer Science and Engineering*


