# Employee Attendance System

## 1. Project Concept and Objectives

### Concept
The Employee Attendance System is a web-based prototype that digitizes employee attendance tracking, leave management, and basic reporting for an organization.

### Objectives
- Replace manual attendance and leave records with a centralized digital system.
- Provide separate features for Admin and Employee roles.
- Support daily check-in/check-out, leave requests, and leave approvals.
- Generate simple attendance insights for management decisions.

## 2. Software Process Model Used

This project followed an **Incremental / Agile-style process**:
- First increment: authentication and role-based access
- Second increment: employee and shift management
- Third increment: attendance tracking and leave workflows
- Final increment: reports, UI improvements, and documentation

This model helped us deliver and test core features step by step.

## 3. Key Design Decisions

- **Frontend**: Next.js with Tailwind and reusable UI components for fast development.
- **Backend**: NestJS for modular architecture (Auth, Employees, Shifts, Attendance, Leave, Reports).
- **Database**: PostgreSQL with Prisma ORM for schema and migration management.
- **Security**: Cookie-based JWT authentication with role guards for Admin/Employee access control.
- **API-first approach**: Clear module-wise REST endpoints for maintainability.

## 4. UML and Requirement Consistency

The SRS requirements were mapped to the implemented modules:
- Login/Logout -> Auth module
- Check In/Check Out + attendance history -> Attendance module
- Submit leave + review/approve/reject leave -> Leave module
- Manage employees -> Employees module
- Manage shifts -> Shifts module
- View summary reports -> Reports module

Included UML diagrams:
- Use Case Diagram
- Class Diagram

## 5. Live Demo / Walkthrough Plan

### Admin Flow
1. Login as Admin
2. Show dashboard statistics
3. Open Shifts and demonstrate shift management
4. Open Employees and show employee records
5. Open Leave and review pending requests
6. Open Reports and show daily summary KPIs

### Employee Flow
1. Login as Employee
2. Show dashboard actions
3. Perform check-in / check-out
4. Open Attendance history
5. Submit a leave request
6. Logout, then show Admin approving/rejecting the request

## 6. Challenges Faced

- Role-based route protection and API authorization handling.
- Attendance logic for valid check-in/check-out states.
- Maintaining consistency between SRS, UML diagrams, and implemented modules.
- Coordinating backend APIs with frontend state management.

## 7. Improvements and Future Scope

- Add biometric or device-based attendance options.
- Add notifications (email/SMS/in-app) for leave approvals and reminders.
- Add advanced analytics (monthly trends, department-wise productivity).
- Add export features (PDF/CSV) for attendance and leave reports.
- Improve test coverage with more automated integration/e2e tests.

## 8. Acknowledgment of AI Assistant Use

AI assistants (such as ChatGPT / Gemini / GitHub Copilot / Claude) were used for:
- understanding implementation patterns,
- documentation support,
- and minor development guidance.

All final design choices, code integration, and project validation were performed by the team.
