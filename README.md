# NileConnect

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/API-Render-46E3B7?logo=render&logoColor=111111)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)

NileConnect is a campus club and event hub for Nile University. It gives students one place to discover active clubs, browse upcoming events, RSVP, and grow into club leadership by creating and managing their own campus community.

## Competition Brief

**Task 3: Club & Event Hub**

Students miss events and do not know which clubs are active on campus. NileConnect solves this with a central platform where clubs can publish events and students can discover, browse, and RSVP to them.

## Live Deployment

- Frontend: `https://nileconnect.vercel.app`
- Backend health check: `https://nileconnect-api.onrender.com/api/health`

## Core Features

- Public home page with campus discovery entry points
- Clubs discovery page with searchable club listings
- Events discovery page with search, categories, and RSVP counts
- Public club profile pages with real club details and upcoming events
- Public event detail pages with rich event information and RSVP state
- Student registration and login with JWT authentication
- RSVP and cancel RSVP for authenticated student and club admin users
- Student-to-club-admin promotion after creating a club
- Club admin dashboard for managing the club workspace
- Club profile creation and editing
- Rich event creation and editing with overview, highlights, target audience, and additional info
- Owner-aware admin protections for club and event management
- Mobile-responsive navigation and layouts for demo use on phones

## Product Rules

- Registration creates **student accounts only**.
- A user becomes a **club admin only by creating a club**.
- Club admins can manage only their own club and events.
- NileConnect is a **campus-focused discovery and management platform**.
- NileConnect is **not** a ticketing, payment, seating, or QR check-in platform.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL via Supabase |
| ORM | TypeORM |
| Validation | Zod |
| Authentication | JWT + bcrypt |
| Deployment | Vercel frontend, Render backend, Supabase database |

## Project Structure

```text
.
|-- backend/        # Express API, auth, clubs, events, RSVPs, migrations, seed script
|-- frontend/       # React app, public pages, auth flow, admin UI
|-- docs/           # Deployment and supporting documentation
|-- render.yaml     # Render backend deployment blueprint
`-- README.md
```

## Local Setup

### 1. Install Dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 2. Configure Environment Variables

Create local env files from the examples:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Backend environment variables:

```text
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=your-local-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Frontend environment variables:

```text
VITE_API_BASE_URL=http://localhost:4000/api
```

Do not commit real `.env` values.

### 3. Run Database Migrations

```powershell
cd backend
npm run migration:run
```

### 4. Optional Demo Seed

Use seed data only when you intentionally want a populated local or demo database:

```powershell
cd backend
npm run seed
```

### 5. Start the App Locally

Backend:

```powershell
cd backend
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

## Build Commands

Backend:

```powershell
cd backend
npm run build
```

Frontend:

```powershell
cd frontend
npm run build
```

## Production Deployment

NileConnect is designed to deploy as:

- **Database:** Supabase Postgres
- **Backend API:** Render Web Service
- **Frontend:** Vercel

Important production defaults:

- Render `CLIENT_URL` must match the exact Vercel frontend domain.
- Vercel `VITE_API_BASE_URL` must include `/api`.
- Supabase is used as Postgres only, not Supabase Auth.
- Migrations should be run against Supabase before final sign-off.

Full deployment guide:

- [Deployment Guide](./docs/DEPLOYMENT.md)

## Demo Flow

Recommended live demo sequence:

1. Open the home page and explain the campus discovery problem.
2. Browse events and filter/search upcoming activities.
3. Open an event detail page and RSVP as a student.
4. Browse clubs and open a public club profile.
5. Register or log in as a student.
6. Create a club to show the student-to-club-admin promotion.
7. Open the My Club dashboard.
8. Edit the club profile.
9. Create or edit a rich event page.
10. Return to the public club/event pages to show the result.

## Demo Accounts

Demo accounts should be created or seeded intentionally for the competition environment. Do not commit production secrets or private credentials to the repository.

If using seeded demo data, use the credentials printed by the seed script output for the current environment.

## API Health Check

```text
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Club & Event Hub backend is running.",
  "data": {
    "status": "ok"
  }
}
```

## Release Smoke Test

- Register a student account.
- Log in and refresh to confirm persistence.
- Browse public clubs and events as a guest.
- Open event detail as a guest and confirm RSVP is blocked.
- RSVP and cancel RSVP as an authenticated user.
- Create a club and confirm role promotion to club admin.
- Open My Club dashboard.
- Edit club profile and confirm changes persist.
- Create a rich event and confirm it appears publicly.
- Edit an event and confirm updates persist.
- Log out and confirm protected routes are blocked.

## Competition Notes

NileConnect fully covers the required task:

- A page where clubs can be listed with basic info.
- An events section where upcoming events are displayed.

It also implements the optional RSVP system and event categories. QR check-in was intentionally left out to keep the product focused and stable for the competition scope.
