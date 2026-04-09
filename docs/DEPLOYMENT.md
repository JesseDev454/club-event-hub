# NileConnect Deployment Guide

## Deployment Stack

- Database: **Supabase Postgres**
- Backend API: **Render Web Service**
- Frontend: **Vercel**

## Required Environment Variables

### Backend on Render

- `NODE_ENV=production`
- `DATABASE_URL=<supabase-session-pooler-url>`
- `JWT_SECRET=<strong-secret>`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=https://<your-vercel-frontend-domain>`

### Frontend on Vercel

- `VITE_API_BASE_URL=https://<your-render-backend-domain>/api`

## Important Defaults

- Use Supabase as **Postgres only**
- Do **not** use Supabase Auth for this app
- Keep `VITE_API_BASE_URL` pointed to the backend URL **with `/api`**
- Keep `CLIENT_URL` set to the **exact** deployed frontend URL for CORS
- Keep TypeORM `synchronize` disabled; production changes should use migrations

## Exact Deployment Order

1. Create a new Supabase project
2. Copy the **Session pooler** Postgres connection string from Supabase
3. Create the Vercel project using `frontend/` as the root directory
4. Reserve or confirm the production frontend URL
5. Create the Render web service using `backend/` as the root directory
6. Set Render environment variables:
   - `NODE_ENV`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `CLIENT_URL`
7. Deploy the Render backend
8. Verify the backend health endpoint:
   - `https://<render-backend-domain>/api/health`
9. Run backend migrations against the Supabase production database
10. Set `VITE_API_BASE_URL` in Vercel to:
    - `https://<render-backend-domain>/api`
11. Deploy the frontend on Vercel
12. Run end-to-end smoke tests in production

## Step-by-Step Setup

### 1. Supabase

1. Create a Supabase project
2. Wait for provisioning to complete
3. Open **Connect**
4. Copy the **Session pooler** connection string
5. Save it as `DATABASE_URL`

Recommended shape:

```text
postgres://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

### 2. Vercel Frontend

1. Import the GitHub repo into Vercel
2. Set:
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add:
   - `VITE_API_BASE_URL=https://placeholder.example.com/api`
4. Create the project so the final frontend URL is reserved

### 3. Render Backend

1. Create a new Render Web Service from the same repo
2. Set:
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install --include=dev && npm run build`
   - Start Command: `npm start`
3. Add environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=<supabase-session-pooler-url>`
   - `JWT_SECRET=<strong-secret>`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=https://<your-vercel-domain>`
4. Deploy
5. Confirm:
   - `GET /api/health`

### 4. Production Migrations

Run migrations against the production database after Supabase and Render are configured.

```powershell
cd backend
npm install
npm run migration:run
```

If you intentionally want demo seed data in production:

```powershell
npm run seed
```

### 5. Connect Frontend to Backend

1. Update Vercel:

```text
VITE_API_BASE_URL=https://<render-backend-domain>/api
```

2. Redeploy the frontend
3. Confirm the live app calls the correct backend

## Production Verification

Test these flows after deployment:

1. Open home page as guest
2. Browse events and clubs
3. Open event detail and club detail
4. Register a student account
5. Log in and refresh to confirm session persistence
6. RSVP to an event as student
7. Create a club and confirm promotion to `club_admin`
8. Open `/admin/events`
9. Edit club profile
10. Create and edit an event
11. Log out and confirm protected routes are blocked

## Official References

- Vercel Git deployment docs: https://vercel.com/docs/deployments/git/vercel-for-github
- Render Node/Express deployment docs: https://render.com/docs/deploy-node-express-app
- Supabase Postgres connection docs: https://supabase.com/docs/guides/database/connecting-to-postgres
