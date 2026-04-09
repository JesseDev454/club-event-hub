# NileConnect

NileConnect is a campus platform for Nile University where students can discover clubs and events, RSVP to events, create clubs, become club admins, manage their club profile, and create rich event pages.

## Product Rules

- Registration creates **student accounts only**
- A user becomes a **club admin only by creating a club**
- NileConnect is a **campus-focused discovery and management platform**, not a ticketing or payment platform

## Stack

- `frontend/`: React + Vite + TypeScript + Tailwind CSS
- `backend/`: Express + TypeScript + TypeORM
- Database: PostgreSQL

## Project Structure

- `frontend/` - public browsing, auth, and admin UI
- `backend/` - REST API, auth, ownership rules, RSVP logic, and migrations
- `docs/` - product, architecture, and deployment documentation
- `render.yaml` - Render deployment blueprint for the backend

## Local Setup

### 1. Install dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

### 2. Configure environment variables

Copy the example files and fill in real values:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Backend variables:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

Frontend variables:

- `VITE_API_BASE_URL`

### 3. Run migrations

```powershell
cd backend
npm run migration:run
```

### 4. Start the backend

```powershell
cd backend
npm run dev
```

### 5. Start the frontend

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

## Deployment

Use:

- **Supabase** for PostgreSQL
- **Render** for the Express backend
- **Vercel** for the Vite frontend

The exact deployment guide is here:

- [Deployment Guide](./docs/DEPLOYMENT.md)

## Demo / Test Accounts

Create fresh demo users in the deployed app, or seed safe demo data only when you intentionally want production demo content.
