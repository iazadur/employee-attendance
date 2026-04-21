# Employee Attendance System — Group Presentation Script
# Divided by Speaker (3 Members)

> **Total Slides: 16 | Estimated Time: 12-15 minutes**
> **Each speaker gets ~4-5 minutes**
> Arrow keys or click to move between slides.

---

## SPEAKER 1 — Md Azadur Rahman (ID: 4478)
**Role: Lead Developer (Software Engineering)**

---

### SLIDE 1 — Title

Assalamu Alaikum everyone. Good morning / Good afternoon.

My name is Md Azadur Rahman, and I am here with my team to present our project — the **Employee Attendance System**.

This is a full-stack web application. We built it to replace manual paper-based attendance with a modern digital system.

Our team has three members:
- Me, Azadur Rahman — ID 4478 — Software Engineering
- Rakib Hossain — ID 4056 — System Administration
- And Aduri Akter — ID 4032 — QA Engineering

We used **Next.js 16** for the frontend, **NestJS 11** for the backend, **PostgreSQL** for the database, and **Docker** for deployment.

*(press right arrow to go next)*

---

### SLIDE 2 — Project Overview

Let me start with a quick overview.

The purpose of this project is simple — to automate employee attendance tracking. In many organizations, attendance is still done on paper or in spreadsheets. This wastes time, creates mistakes, and makes it hard to find old records.

Our system solves this by providing:
- Real-time attendance tracking
- Leave management with approval workflow
- Shift scheduling
- And reporting dashboards

The architecture is straightforward. The user opens the browser, which connects to our Next.js frontend. The frontend talks to our NestJS REST API. The API connects to PostgreSQL database. Everything runs inside Docker containers.

*(press right arrow to go next)*

---

### SLIDE 3 — Team & Roles

Here is our team. Each member had a clear responsibility:

- **I (Azadur)** was responsible for software engineering — designing the backend architecture, building the API with NestJS, and writing the core business logic
- **Rakib** handled system administration — Docker setup, deployment, database management, and environment configuration
- **Aduri** was our QA engineer — writing tests, doing manual testing, and making sure everything works correctly

We worked together and helped each other throughout the project.

*(press right arrow to go next)*

---

### SLIDE 4 — Technology Stack

Now let me talk about the technologies we used.

**On the frontend:**
- **Next.js 16** with App Router — for fast page loading and routing
- **React 19** — for building the user interface
- **TypeScript** — for catching errors during development
- **Tailwind CSS and shadcn/ui** — for clean and responsive styling

**On the backend:**
- **NestJS 11** — a powerful Node.js framework with modular structure
- **Prisma ORM** — for type-safe database queries
- **Passport.js with JWT** — for secure authentication
- **bcrypt** — for password hashing

**Database:**
- **PostgreSQL 16** — a strong and reliable relational database

**Deployment:**
- **Docker and Docker Compose** — everything runs in containers
- Database migrations run automatically on startup

*(press right arrow to go next)*

---

### SLIDE 5 — Functional Requirements

Here are the main functional requirements of our system.

**Number one — Authentication and Authorization.** We use JWT tokens stored in HTTP-only cookies. There are three roles — Admin, Manager, and Employee — each with different permissions.

**Number two — Employee Management.** Admin can create, update, and deactivate employee accounts. Each employee has a unique code, department, designation, and contact information.

**Number three — Attendance Tracking.** Employees can check in and check out. The system automatically calculates the status — present, late, half-day, or absent.

**Number four — Leave Management.** Employees submit leave requests. Admin or manager can approve or reject them.

**Number five — Reports and Dashboard.** Real-time KPIs, monthly summaries, and chart visualizations.

*(press right arrow — I will now hand over to Rakib)*

---

## SPEAKER 2 — Rakib Hossain (ID: 4056)
**Role: System Administration**

---

### SLIDE 6 — Non-Functional Requirements

Thank you Azadur. Now I will talk about the non-functional requirements.

**Performance** — Our API responses are under 500 milliseconds. We use optimized queries through Prisma, and the frontend uses code splitting for fast loading.

**Security** — We store JWT in HTTP-only cookies so they cannot be stolen by JavaScript. Passwords are hashed with bcrypt. We have role-based guards and input validation using class-validator.

**Scalability** — The system is Dockerized and uses a stateless API design. The NestJS architecture is modular, so new features can be added easily.

**Usability** — The UI is responsive and works on both mobile and desktop. The navigation is simple and forms show clear validation messages.

*(press right arrow to go next)*

---

### SLIDE 7 — How It Works

Let me walk you through how the system works in practice.

**Step 1** — The admin creates employee accounts and assigns them to shifts.

**Step 2** — Each employee logs in with their email and password.

**Step 3** — When an employee arrives, they click "Check In." When they leave, they click "Check Out."

**Step 4** — The system records the times and calculates the attendance status automatically based on the shift schedule.

**Step 5** — If an employee needs leave, they submit a request. The admin or manager reviews and approves or rejects it.

**Step 6** — The dashboard shows real-time data — who is present, who is absent, monthly reports, and visual charts.

*(press right arrow to go next)*

---

### SLIDE 8 — Use Case Diagram

This is our use case diagram. It shows how the three types of users — Admin, Manager, and Employee — interact with the system.

As you can see, the Admin has the most access — managing employees, shifts, and attendance. The Manager can review leaves and view reports. And the Employee can check in, check out, and submit leave requests.

*(press right arrow to go next)*

---

### SLIDE 9 — Class Diagram

This is the class diagram showing our database design.

The main entities are User, Employee, Shift, AttendanceRecord, and LeaveRequest.

A User has one Employee profile. An Employee belongs to one Shift. An Employee has many Attendance Records and many Leave Requests. Leave requests are reviewed by an Admin or Manager.

*(press right arrow to go next)*

---

### SLIDE 10 — Dashboard & Employees

Now let me show you the actual application.

This is the **Dashboard** page. At the top, you can see the KPIs — total employees, how many are present today, absent, and late. Below that, there are charts showing monthly attendance trends.

And this is the **Employees** page. The admin can see all employees, search by name, and create new employee accounts.

*(press right arrow to go next)*

---

### SLIDE 11 — Attendance & Leave

Here is the **Attendance** page. Employees can check in with one click. The system records the time and shows the attendance history with status badges.

And this is the **Leave** page. Employees can submit leave requests by selecting the leave type, start date, end date, and reason. The admin sees all pending requests and can approve or reject them.

*(press right arrow — I will now hand over to Aduri)*

---

## SPEAKER 3 — Aduri Akter (ID: 4032)
**Role: QA Engineer**

---

### SLIDE 12 — Shifts & Reports

Thank you Rakib. Now I will continue.

This is the **Shifts** page. The admin creates shifts by setting the name, start time, end time, working days, and grace minutes. For example, if a shift starts at 9 AM with 15 minutes grace, then checking in after 9:15 will be marked as late.

And this is the **Reports** page. It shows attendance analytics with visual charts. Management can filter by date range and see patterns in employee attendance.

*(press right arrow to go next)*

---

### SLIDE 13 — Testing Strategy

As the QA engineer, I was responsible for testing. We used three levels of testing.

**Level 1 — Unit Testing.** We tested individual service methods in isolation using Jest. We have test files for auth, attendance, employees, leave, and shifts services. Dependencies are mocked so we test each part independently.

**Level 2 — Integration Testing.** We tested API endpoints using Supertest. These tests check real database interactions through Prisma — testing the full auth flow, attendance check-in and check-out, and leave review process.

**Level 3 — System Testing.** We validated the complete workflow across all three roles — Admin, Manager, and Employee. We tested the UI on different screen sizes and performed manual testing with seed data that includes 36 sample users.

We also used **Postman** for testing API endpoints during development.

*(press right arrow to go next)*

---

### SLIDE 14 — Challenges & Solutions

During the project, we faced some challenges.

**Challenge 1 — JWT Authentication.** It was difficult to connect the frontend and backend with cookie-based JWT and proper CORS settings. We solved this by using HTTP-only cookies with Passport JS, configuring CORS credentials, and creating a validation endpoint at `/auth/me`.

**Challenge 2 — Role-Based Access.** Managing permissions for three different roles was complex. We solved this by building custom guards and decorators in NestJS, and making the frontend show different pages based on the user's role.

**Challenge 3 — Docker Deployment.** We needed the database to migrate automatically when containers start. We solved this by creating an entrypoint script that runs `prisma migrate deploy` on startup.

*(press right arrow to go next)*

---

### SLIDE 15 — Live Demo & Source Code

Our system is fully deployed and running online.

You can visit the live application at **attendance.azadur.com.bd**

And the complete source code is available on GitHub at **github.com/iazadur/employee-attendance**

We can do a live demo right now if you would like to see it.

*(press right arrow to go next)*

---

### SLIDE 16 — Conclusion & Future Work (All three speakers together)

**To summarize:**
We built a complete attendance management system with secure login, role-based access, attendance tracking with check-in and check-out, leave management, shift scheduling, and reporting dashboards.

**In the future, we want to add:**
- Biometric and fingerprint integration
- Payroll and salary calculation
- Multi-organization support
- Email and SMS notifications
- A mobile app
- And geo-fenced check-in

**Thank you everyone for listening to our presentation.**
We are now ready for your questions.

---

## Quick Reference — Who Speaks Which Slide

| Slide | Topic | Speaker |
|-------|-------|---------|
| 1 | Title | **Azadur** |
| 2 | Project Overview | **Azadur** |
| 3 | Team & Roles | **Azadur** |
| 4 | Technology Stack | **Azadur** |
| 5 | Functional Requirements | **Azadur** |
| 6 | Non-Functional Requirements | **Rakib** |
| 7 | How It Works | **Rakib** |
| 8 | Use Case Diagram | **Rakib** |
| 9 | Class Diagram | **Rakib** |
| 10 | Dashboard & Employees | **Rakib** |
| 11 | Attendance & Leave | **Rakib** |
| 12 | Shifts & Reports | **Aduri** |
| 13 | Testing Strategy | **Aduri** |
| 14 | Challenges & Solutions | **Aduri** |
| 15 | Live Demo & Source Code | **Aduri** |
| 16 | Conclusion & Future Work | **All together** |

---

## Tips for Presenting

- **Speak slowly** — do not rush. Take a breath between slides.
- **Look at the teacher** and audience, not just the screen.
- **Use the slides as a guide** — do not read everything word by word.
- **Hand over smoothly** — say "Now I will hand over to [name]" when switching speakers.
- **If you forget something** — just move to the next point. Do not stop or panic.
- **If the teacher asks a question** — listen carefully, take 2 seconds to think, then answer.
