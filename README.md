# Employee Attendance System (University Project)

Tech stack:
- **Frontend**: Next.js + TailwindCSS + shadcn UI + Redux Toolkit Query
- **Backend**: NestJS + Prisma
- **Database**: PostgreSQL (via Docker Compose)

## Quick Start (Local)

### 1) Start PostgreSQL

From repo root:

```bash
docker compose up -d
```

### 2) Backend (NestJS)

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run db:seed
npm run start:dev
```

Backend runs on `http://localhost:3001` (configured in `backend/.env`).

### 3) Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Default Credentials (Dev)

These come from `backend/.env`:
- **Admin email**: `SEED_ADMIN_EMAIL`
- **Admin password**: `SEED_ADMIN_PASSWORD`

You can change them and rerun:

```bash
cd backend
npm run db:seed
```

## Modules Implemented

- **Auth**: cookie-based JWT (`/auth/login`, `/auth/logout`, `/auth/me`)
- **Users**: `/users/me`, admin-only `/users`
- **Employees** (admin): CRUD + deactivate
- **Shifts** (admin): CRUD
- **Attendance** (employee): check-in/out + list
- **Leave**: employee request + list; admin approve/reject
- **Reports**: today KPI summary

## Diagrams & SRS

See the `docs/` folder for:
- Use case diagrams
- Class diagrams
- SRS files