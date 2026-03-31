# Club & Event Hub

## Sprint 0 Implementation Blueprint

This document covers Sprint 0 only. It is the practical setup guide for establishing the project foundation before any real feature work begins.

## 1. Monorepo / Project Structure

### Recommendation
Use one repository with two top-level folders:
- `frontend`
- `backend`

This is the best MVP choice because:
- it keeps the full project in one place
- frontend and backend can evolve together
- setup, documentation, and submission stay simpler for a solo developer

### Recommended Root Structure

```text
Club And Event Hub/
  backend/
  frontend/
  docs/
  .gitignore
  README.md
```

### Recommended Backend Structure

```text
backend/
  src/
    app.ts
    server.ts
    config/
      env.ts
      data-source.ts
    entities/
      User.ts
      Club.ts
      Event.ts
      RSVP.ts
    modules/
      auth/
        auth.routes.ts
        auth.controller.ts
        auth.service.ts
        auth.validation.ts
      users/
        users.routes.ts
        users.controller.ts
        users.service.ts
      clubs/
        clubs.routes.ts
        clubs.controller.ts
        clubs.service.ts
      events/
        events.routes.ts
        events.controller.ts
        events.service.ts
        events.validation.ts
      rsvps/
        rsvps.routes.ts
        rsvps.controller.ts
        rsvps.service.ts
    middleware/
      auth.middleware.ts
      role.middleware.ts
      validate.middleware.ts
      error.middleware.ts
      not-found.middleware.ts
    routes/
      index.ts
      health.routes.ts
    utils/
      ApiError.ts
      asyncHandler.ts
      apiResponse.ts
    types/
      express.d.ts
  migrations/
  scripts/
    seed.ts
  .env.example
  .gitignore
  package.json
  tsconfig.json
```

### Recommended Frontend Structure

```text
frontend/
  src/
    main.tsx
    App.tsx
    assets/
    api/
      client.ts
      authApi.ts
      clubsApi.ts
      eventsApi.ts
      rsvpsApi.ts
    components/
      ui/
        Button.tsx
        Input.tsx
        ErrorMessage.tsx
        LoadingState.tsx
        EmptyState.tsx
      common/
        Navbar.tsx
        PageContainer.tsx
    layouts/
      MainLayout.tsx
      AuthLayout.tsx
    pages/
      HomePage.tsx
      LoginPage.tsx
      RegisterPage.tsx
      ClubsPage.tsx
      ClubDetailPage.tsx
      EventsPage.tsx
      EventDetailPage.tsx
      AdminEventsPage.tsx
      AdminCreateEventPage.tsx
      AdminEditEventPage.tsx
      NotFoundPage.tsx
    routes/
      AppRouter.tsx
      ProtectedRoute.tsx
      RoleProtectedRoute.tsx
    state/
      AuthContext.tsx
    lib/
      utils.ts
    styles/
      index.css
  public/
  .env.example
  .gitignore
  package.json
  tsconfig.json
  vite.config.ts
```

This structure is intentionally light. It is enough for the MVP without becoming over-engineered.

## 2. Backend Setup Steps

### Step 1: Initialize the Backend Project
Inside the project root:

```bash
mkdir backend
cd backend
npm init -y
```

### Step 2: Install Runtime Dependencies
Install:
- `express`
- `cors`
- `dotenv`
- `pg`
- `reflect-metadata`
- `typeorm`
- `bcryptjs`
- `jsonwebtoken`
- `zod`

Note:
- `bcryptjs` and `jsonwebtoken` are not used fully in Sprint 0, but installing them now is reasonable because auth starts next sprint.
- If you want Sprint 0 to stay ultra-strict, you can defer those two packages to Sprint 1.

### Step 3: Install Dev Dependencies
Install:
- `typescript`
- `ts-node-dev`
- `@types/node`
- `@types/express`
- `@types/cors`
- `@types/jsonwebtoken`
- `@types/bcryptjs`

Optional but useful:
- `eslint`
- `prettier`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`

### Step 4: Set Up TypeScript
Create `tsconfig.json` configured for:
- `rootDir` = `src`
- `outDir` = `dist`
- `module` compatible with Node setup
- `target` modern enough for current Node
- `experimentalDecorators = true`
- `emitDecoratorMetadata = true`
- `strict = true`

Those decorator options are required for TypeORM entity decorators.

### Step 5: Create Base Express App
Create:
- `src/app.ts`
- `src/server.ts`

Responsibilities:
- `app.ts`
  - create Express app
  - register middleware
  - register routes
  - register not-found and error handlers
- `server.ts`
  - initialize database connection
  - start the HTTP server

### Step 6: Set Up Environment Variable Loading
Create:
- `.env.example`
- `src/config/env.ts`

Use `dotenv` to load variables early.

The env config file should:
- read required environment variables
- provide defaults where safe
- fail early if required values are missing

### Step 7: Set Up PostgreSQL Connection
Create:
- `src/config/data-source.ts`

Responsibilities:
- import `reflect-metadata`
- configure TypeORM `DataSource`
- load database credentials from env
- register entities
- register migrations directory

Use a single `DATABASE_URL` if possible for simplicity.

### Step 8: Set Up Entity Files
Create placeholder entity files now:
- `User.ts`
- `Club.ts`
- `Event.ts`
- `RSVP.ts`

Do not fully implement business fields yet if you want to stay strict, but the files should exist and be ready for Sprint 1 and Sprint 2 work.

### Step 9: Set Up Migration Support
Use migrations from the beginning.

Why:
- database schema changes stay explicit
- local and deployed environments stay consistent
- it prevents “works on my machine” schema drift later

Add package scripts for:
- starting dev server
- building TypeScript
- running migrations
- generating migrations if needed
- running the seed script later

### Step 10: Add Health Route
Create:
- `src/routes/health.routes.ts`

Register:
- `GET /api/health`

This route should return a simple JSON success response confirming the server is up.

### Step 11: Add Error Handling Foundation
Create:
- `ApiError.ts`
- `asyncHandler.ts`
- `not-found.middleware.ts`
- `error.middleware.ts`

Purpose:
- centralize error responses
- avoid repetitive try/catch in controllers later
- standardize how API errors are returned

### Step 12: Add Validation Foundation
Create:
- `validate.middleware.ts`

Use `zod` as the validation library.

Even if few schemas exist in Sprint 0, set up the validation pattern now so later modules follow one consistent approach.

### Step 13: Add Base Module Skeleton
Create placeholder files for:
- auth
- users
- clubs
- events
- rsvps

Each module should already have:
- route file
- controller file
- service file
- validation file where appropriate

These can export placeholders for now.

## 3. Frontend Setup Steps

### Step 1: Initialize the Frontend Project
From the project root:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

Vite is the most practical choice for a fast React MVP setup.

### Step 2: Install Runtime Dependencies
Install:
- `react-router-dom`
- `axios`
- `clsx`

Keep runtime dependencies minimal.

### Step 3: Install Tailwind CSS
Install Tailwind and its required tooling.

Set up:
- Tailwind config
- PostCSS config
- global stylesheet with Tailwind directives

Configure Tailwind content paths to scan all React source files.

### Step 4: Set Up Routing
Create:
- `src/routes/AppRouter.tsx`
- `src/routes/ProtectedRoute.tsx`
- `src/routes/RoleProtectedRoute.tsx`

Even though auth logic is not implemented yet, create placeholder guards so the routing structure is ready.

### Step 5: Set Up API Client
Create:
- `src/api/client.ts`

Responsibilities:
- configure base URL from env
- centralize API request setup
- leave room for auth token attachment later

Then create placeholder service files:
- `authApi.ts`
- `clubsApi.ts`
- `eventsApi.ts`
- `rsvpsApi.ts`

### Step 6: Set Up Basic Layout Shell
Create:
- `MainLayout.tsx`
- `AuthLayout.tsx`
- `Navbar.tsx`
- `PageContainer.tsx`

The purpose is to establish:
- consistent spacing
- shared header/nav
- a clean page frame for all future pages

### Step 7: Add Placeholder Pages
Create all route pages now, even as placeholders:
- Home
- Register
- Login
- Clubs
- Club Detail
- Events
- Event Detail
- Admin Events
- Admin Create Event
- Admin Edit Event
- Not Found

This helps with:
- route wiring
- navigation testing
- frontend structure stability before feature work

### Step 8: Set Up Shared UI States
Create placeholder shared components:
- `LoadingState`
- `EmptyState`
- `ErrorMessage`
- `Button`
- `Input`

This avoids repetitive ad hoc UI later.

### Step 9: Add Auth State Skeleton
Create:
- `src/state/AuthContext.tsx`

For Sprint 0, it can be a placeholder context with a shape that anticipates:
- `user`
- `token`
- `isAuthenticated`
- `loading`

This lets route guards and navbar wiring happen early.

## 4. Recommended Dependencies

### Backend Runtime Dependencies
- `express`
- `cors`
- `dotenv`
- `pg`
- `reflect-metadata`
- `typeorm`
- `zod`

Optional now, but acceptable to install in Sprint 0:
- `bcryptjs`
- `jsonwebtoken`

### Backend Dev Dependencies
- `typescript`
- `ts-node-dev`
- `@types/node`
- `@types/express`
- `@types/cors`
- `@types/jsonwebtoken`
- `@types/bcryptjs`
- `eslint`
- `prettier`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`

### Frontend Runtime Dependencies
- `react-router-dom`
- `axios`
- `clsx`

### Frontend Dev Dependencies
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `typescript`
- `eslint`
- `prettier`

### Dependency Notes
- Do not add Redux for this MVP
- Do not add React Query unless you know you want it
- Do not add a component library in Sprint 0
- Do not add form libraries yet unless you know they will be used consistently later

Keep the baseline small.

## 5. Environment Variables

### Backend `.env.example`

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/club_event_hub
JWT_SECRET=replace_with_a_secure_value_later
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Backend Variable Purpose
- `PORT`
  - the port the Express API runs on
- `NODE_ENV`
  - environment mode
- `DATABASE_URL`
  - PostgreSQL connection string for TypeORM
- `JWT_SECRET`
  - signing secret for JWT in Sprint 1 and later
- `JWT_EXPIRES_IN`
  - token lifetime configuration for Sprint 1 and later
- `CLIENT_URL`
  - frontend origin for CORS configuration

### Frontend `.env.example`

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Frontend Variable Purpose
- `VITE_API_BASE_URL`
  - base URL used by the API client for backend requests

## 6. Database Setup Plan

### Local PostgreSQL Database
Create a local PostgreSQL database named:
- `club_event_hub`

Recommended local flow:
1. install PostgreSQL locally
2. create a database user if needed
3. create the database
4. verify local connection using the same credentials placed in `DATABASE_URL`

### TypeORM Configuration Approach
Use a single central `DataSource` configuration with:
- PostgreSQL driver
- entity registration
- migrations registration
- `synchronize: false`

Important:
- Do not use `synchronize: true` for this project
- Use migrations from the beginning

### Should Migrations Be Used From the Beginning?
Yes.

This is the recommended MVP choice because:
- schema history stays controlled
- team or deployment consistency improves
- later changes are easier to track

### Initial Seed Strategy
Do not build a full seed system yet, but prepare a simple seed script structure now.

Seed plan for later:
- create 2 to 4 sample clubs
- create 1 sample `club_admin`
- create 1 sample student user
- create a few sample events after event entities are ready

In Sprint 0, the important thing is to create:
- `scripts/seed.ts`
- a package script placeholder for running seeds later

## 7. Initial Backend Module Skeleton

These modules should exist now, even if the implementation is mostly placeholder.

### `auth`
Files:
- `auth.routes.ts`
- `auth.controller.ts`
- `auth.service.ts`
- `auth.validation.ts`

Purpose now:
- reserve the auth module structure
- define where registration and login logic will go in Sprint 1

### `users`
Files:
- `users.routes.ts`
- `users.controller.ts`
- `users.service.ts`

Purpose now:
- reserve current-user and user-related read logic structure

### `clubs`
Files:
- `clubs.routes.ts`
- `clubs.controller.ts`
- `clubs.service.ts`

Purpose now:
- reserve public club read functionality location

### `events`
Files:
- `events.routes.ts`
- `events.controller.ts`
- `events.service.ts`
- `events.validation.ts`

Purpose now:
- reserve event listing and admin CRUD structure

### `rsvps`
Files:
- `rsvps.routes.ts`
- `rsvps.controller.ts`
- `rsvps.service.ts`

Purpose now:
- reserve RSVP logic structure

### Shared Middleware / Config / Utils
Create these now:

`config/`
- `env.ts`
- `data-source.ts`

`middleware/`
- `auth.middleware.ts`
- `role.middleware.ts`
- `validate.middleware.ts`
- `not-found.middleware.ts`
- `error.middleware.ts`

`utils/`
- `ApiError.ts`
- `asyncHandler.ts`
- `apiResponse.ts`

`routes/`
- `index.ts`
- `health.routes.ts`

The placeholders matter because they stabilize the code organization before real feature work begins.

## 8. Initial Frontend Structure

### `pages/`
Create all main page files now as placeholders:
- `HomePage`
- `RegisterPage`
- `LoginPage`
- `ClubsPage`
- `ClubDetailPage`
- `EventsPage`
- `EventDetailPage`
- `AdminEventsPage`
- `AdminCreateEventPage`
- `AdminEditEventPage`
- `NotFoundPage`

### `components/`
Create:

`ui/`
- `Button`
- `Input`
- `ErrorMessage`
- `LoadingState`
- `EmptyState`

`common/`
- `Navbar`
- `PageContainer`

### `layouts/`
- `MainLayout`
- `AuthLayout`

### `api/`
- `client.ts`
- `authApi.ts`
- `clubsApi.ts`
- `eventsApi.ts`
- `rsvpsApi.ts`

These can export placeholders now.

### `state/`
- `AuthContext.tsx`

This should define the future auth state shape, even if the provider logic is still basic.

### `routes/`
- `AppRouter.tsx`
- `ProtectedRoute.tsx`
- `RoleProtectedRoute.tsx`

For Sprint 0, these can be mostly structural placeholders.

### Shared UI States
The goal in Sprint 0 is not styling perfection. It is consistency:
- one loading component
- one empty-state component
- one error component
- one page container pattern

This will save time during Sprint 2 to Sprint 4.

## 9. Sprint 0 Deliverables Checklist

- One repository with `frontend` and `backend`
- Backend initialized with Node.js, Express, TypeScript, and TypeORM
- Frontend initialized with React, Vite, TypeScript, and Tailwind CSS
- PostgreSQL connection configured in backend
- TypeORM data source file created
- Migration setup ready
- `.env.example` files created for backend and frontend
- Health endpoint created and reachable
- Global backend error-handling foundation created
- Backend module skeleton created:
  - auth
  - users
  - clubs
  - events
  - rsvps
- Frontend routing structure created
- Placeholder pages created
- Basic layout shell created
- API client file created
- Auth context skeleton created
- Seed script placeholder created
- README updated with local setup instructions

## 10. Sprint 0 Exit Criteria

Sprint 0 is done when all of the following are true:

- `frontend` and `backend` both run locally
- backend connects successfully to PostgreSQL
- `GET /api/health` returns a success response
- Tailwind is working in the frontend
- frontend routing works across placeholder pages
- backend folder structure matches the planned architecture
- frontend folder structure matches the planned architecture
- environment variables are externalized and documented
- migration workflow is set up and ready for real schema work
- no business logic has been prematurely mixed into setup files

At that point, Sprint 1 can begin safely.

## 11. Common Mistakes to Avoid in Sprint 0

### 1. Using `synchronize: true` in TypeORM
This is tempting for speed, but it creates schema drift and makes later deployment harder. Use migrations instead.

### 2. Delaying module structure until feature work starts
If the folders and placeholder files are not created now, later sprints become messy and inconsistent.

### 3. Overbuilding architecture
Do not add:
- Redux
- microservices
- Docker-only complexity if not needed
- complex state libraries
- advanced design systems

Sprint 0 should stay lean.

### 4. Skipping shared error handling
If you wait too long to standardize error handling, controllers become inconsistent and harder to clean up later.

### 5. Hardcoding configuration
Do not hardcode:
- database credentials
- API base URLs
- port values
- frontend-backend origins

Use env files from the start.

### 6. Creating incomplete placeholder routes without final path alignment
Use the actual planned route structure now so later sprints do not require unnecessary refactors.

### 7. Ignoring README setup documentation
Even in Sprint 0, document:
- how to install dependencies
- how to run frontend
- how to run backend
- how to configure env files
- how to start PostgreSQL locally

This will help final submission and prevent setup confusion later.

### 8. Jumping ahead into business logic
Do not implement:
- auth flow
- clubs feature logic
- event CRUD
- RSVP logic

Sprint 0 is about structure and readiness, not feature completion.

## Final Sprint 0 Focus

Sprint 0 should leave the project in a state where:
- structure is stable
- tooling works
- local development is easy
- future modules already have a clear home

That is the strongest foundation for Sprint 1.
