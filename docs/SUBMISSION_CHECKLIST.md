# University Submission Checklist

## 1) Pre-demo setup

- Start database: `docker compose up -d`
- Start backend: `cd backend && npm run start:dev`
- Start frontend: `cd frontend && npm run dev`
- Verify:
  - Frontend opens at `http://localhost:3000`
  - Backend opens at `http://localhost:3001`

## 2) Demo flow (recommended order)

1. Login as **Admin**
2. Open **Dashboard** (show KPI cards)
3. Open **Shifts** and show existing shift
4. Open **Employees** and show employee list
5. Open **Leave** and show pending/approved requests
6. Open **Reports** and show today summary
7. Logout
8. Login as **Employee**
9. Open **Dashboard** and show check-in/check-out actions
10. Open **Attendance** and show history table
11. Open **Leave** and create a leave request
12. Logout
13. Login as **Admin** again and approve/reject that request

## 3) Screenshots list for report/presentation

Take these screenshots (minimum):

1. Login page
2. Admin dashboard
3. Shifts page (table + create dialog)
4. Employees page (table + create dialog)
5. Attendance page (employee history)
6. Leave page (employee request)
7. Leave page (admin approval action)
8. Reports page (KPI cards)
9. API test screenshot (optional: Postman/cURL response)
10. Database tables view (optional: Prisma Studio/DB tool)

## 4) Submission package checklist

- Source code folder includes `backend/`, `frontend/`, `docs/`
- Updated root `README.md` with setup instructions
- SRS and diagrams included in `docs/`
- Screenshots folder prepared for report
- Demo credentials documented in a private note (not public)

## 5) Final verification commands

- Backend build:
  - `cd backend && npm run build`
- Frontend lint/build:
  - `cd frontend && npm run lint && npm run build`

