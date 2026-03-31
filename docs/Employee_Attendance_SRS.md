# Software Requirements Specification (SRS)

## Employee Attendance System (Simplified)

## 1. Introduction

### 1.1 Purpose

This document defines the requirements for a simple Employee Attendance System for a university project. The system allows employees to record attendance and allows an admin to monitor and manage attendance records.

### 1.2 Scope

The system is a web-based attendance application with basic features:

- Employee login
- Check-in and check-out
- View personal attendance history
- Submit leave requests
- Admin management of employees and attendance reports

This is a simplified version and does not include biometric hardware integration, payroll processing, or complex analytics.

### 1.3 Intended Users

- Employees
- Admin

### 1.4 Definitions

- Check-in: Time when an employee starts work.
- Check-out: Time when an employee ends work.
- Attendance Record: Daily record containing check-in, check-out, and attendance status.
- Leave Request: Employee request for leave approval.

## 2. Overall Description

### 2.1 Product Perspective

The system is standalone and stores attendance data in a database. Employees and admin access it using username/email and password.

### 2.2 Product Functions

- User authentication (login/logout)
- Employee attendance marking (check-in/check-out)
- Attendance history viewing
- Leave request submission and status tracking
- Admin employee management
- Admin leave approval/rejection
- Admin report generation (daily/monthly summary)

### 2.3 User Characteristics

- Employees: Basic computer knowledge.
- Admin: Responsible for monitoring attendance and approving leave.

### 2.4 Assumptions and Constraints

- The system runs on a local or university server.
- Internet/browser access is available.
- Time is captured from server time.
- One employee can check in once and check out once per day.

## 3. Functional Requirements

### 3.1 Authentication

- FR-1: The system shall allow users to log in using email/username and password.
- FR-2: The system shall allow users to log out securely.

### 3.2 Employee Functions

- FR-3: The system shall allow employees to check in once per day.
- FR-4: The system shall allow employees to check out once per day after check-in.
- FR-5: The system shall store date, check-in time, check-out time, and status for each record.
- FR-6: The system shall allow employees to view their attendance history by date range.
- FR-7: The system shall allow employees to submit leave requests with start date, end date, and reason.
- FR-8: The system shall allow employees to view leave request status (Pending/Approved/Rejected).

### 3.3 Admin Functions

- FR-9: The system shall allow admin to add, edit, and deactivate employee accounts.
- FR-10: The system shall allow admin to view all attendance records.
- FR-11: The system shall allow admin to approve or reject leave requests.
- FR-12: The system shall allow admin to generate simple attendance reports (daily and monthly).

### 3.4 Business Rules

- FR-13: Check-out is not allowed before check-in.
- FR-14: If an employee does not check in, status is Absent.
- FR-15: Late status is assigned if check-in is after the configured office start time.

## 4. Non-Functional Requirements

### 4.1 Performance

- NFR-1: Typical user actions (login, check-in, check-out) should complete within 2 seconds under normal load.

### 4.2 Security

- NFR-2: Passwords shall be stored in hashed format.
- NFR-3: Role-based access control shall restrict admin functions to admin users.

### 4.3 Usability

- NFR-4: The interface shall be simple and mobile-friendly.
- NFR-5: Attendance actions should be accessible within 2 clicks after login.

### 4.4 Reliability

- NFR-6: The system shall keep attendance data persistent after restart.

## 5. External Interface Requirements

### 5.1 User Interface

- Login page
- Employee dashboard (check-in/check-out, history, leave)
- Admin dashboard (employees, attendance records, leave approvals, reports)

### 5.2 Software Interface

- Relational database (for example MySQL/PostgreSQL/SQLite)

## 6. Data Requirements

### 6.1 Main Entities

- User (user_id, name, email, password_hash, role)
- Employee (employee_id, user_id, department, designation)
- AttendanceRecord (record_id, employee_id, date, check_in, check_out, status, work_hours)
- LeaveRequest (leave_id, employee_id, start_date, end_date, reason, status)
- Report (report_id, month, year, generated_by)

## 7. Use Case Summary

- UC-1: Employee Login
- UC-2: Check In
- UC-3: Check Out
- UC-4: View Attendance History
- UC-5: Submit Leave Request
- UC-6: View Leave Status
- UC-7: Manage Employees (Admin)
- UC-8: Approve/Reject Leave (Admin)
- UC-9: Generate Attendance Report (Admin)

## 8. Future Enhancements (Optional)

- Biometric device integration
- Email notifications
- Payroll integration
- Department-wise analytics dashboard
