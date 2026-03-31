# Club & Event Hub

## Final Technical Architecture Plan

This document defines the implementation architecture for the Club & Event Hub MVP. It is based on the locked product decisions and is intentionally designed for a solo developer building within a short sprint.

## 1. Architecture Overview

Club & Event Hub will be built as a web-based client-server application with three clear layers:

### Frontend
A React single-page application will provide the user interface for students and club admins.

Responsibilities:
- Render public and authenticated screens
- Handle navigation and form interactions
- Call backend REST endpoints
- Store and use JWT-based auth state on the client
- Display validation and error messages

### Backend
A Node.js + Express API will contain all business logic, authentication, authorization, and data access.

Responsibilities:
- Expose REST endpoints for frontend consumption
- Authenticate users with JWT
- Enforce role-based and ownership-based access rules
- Validate input
- Coordinate CRUD operations using TypeORM
- Return consistent JSON responses

### Database
PostgreSQL will store persistent application data.

Responsibilities:
- Store users, clubs, events, and RSVPs
- Enforce relational integrity
- Enforce uniqueness where needed, especially duplicate RSVP prevention

The frontend never connects directly to the database. All reads and writes go through the backend API.

## 2. Architectural Style

### Layered Architecture
The backend should follow a simple layered architecture:

- `routes`
  - Define endpoint paths and attach middleware
- `controllers`
  - Receive requests and shape responses
- `services`
  - Contain business logic
- `entities/repositories`
  - Represent and access database models through TypeORM

This structure is appropriate for MVP because it keeps code organized without introducing heavy architectural patterns.

### REST API Communication Model
The frontend and backend will communicate through JSON-based REST APIs over HTTP.

Recommended conventions:
- `GET` for reads
- `POST` for creation and login actions
- `PUT` for full updates
- `DELETE` for deletions and RSVP cancellation

The frontend should treat the backend as the single source of truth for auth, permissions, clubs, events, and RSVPs.

## 3. High-Level System Components

### Frontend App
The React app renders:
- Public pages
- Auth pages
- Student browsing pages
- Admin event management pages

It sends HTTP requests to the backend using an API service layer.

### Backend API
The Express server exposes the MVP endpoints and coordinates:
- auth
- users
- clubs
- events
- rsvps

### Auth Middleware
JWT middleware verifies the user token on protected routes and attaches the authenticated user context to the request.

### Core Modules
#### `auth`
- Register student accounts
- Log in users
- Return current authenticated user

#### `users`
- Return basic user profile information needed by the frontend

#### `clubs`
- Return club list
- Return club detail
- Return events belonging to a club

#### `events`
- Return upcoming events
- Return event detail
- Allow club admins to create, update, and delete events for their own club

#### `rsvps`
- Create RSVP
- Cancel RSVP
- Return RSVP count for event detail and event listings

### Database
PostgreSQL stores the final source of record. TypeORM maps application entities to database tables.

### Interaction Summary
1. User interacts with the React frontend
2. Frontend sends request to Express API
3. API authenticates and validates request
4. Service layer executes business logic
5. TypeORM reads or writes PostgreSQL data
6. API returns JSON response
7. Frontend updates the UI

## 4. Frontend Architecture

### Main Pages
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

### Shared Components
- `Navbar`
- `PageContainer`
- `ProtectedRoute`
- `RoleProtectedRoute`
- `ClubCard`
- `EventCard`
- `EventForm`
- `InputField`
- `Button`
- `LoadingState`
- `EmptyState`
- `ErrorMessage`

These should stay small and reusable. The MVP should avoid over-componentization.

### Routing Structure
Suggested route structure:

- `/`
- `/register`
- `/login`
- `/clubs`
- `/clubs/:id`
- `/events`
- `/events/:id`
- `/admin/events`
- `/admin/events/new`
- `/admin/events/:id/edit`

Access rules:
- Public routes: home, register, login, clubs, club detail, events, event detail
- Authenticated student routes: RSVP actions happen from event detail, not through a separate page
- Authenticated admin routes: admin event management pages

### API Service Layer
The frontend should include a small service layer such as:
- `authApi`
- `clubsApi`
- `eventsApi`
- `rsvpsApi`

Responsibilities:
- Centralize HTTP requests
- Attach JWT to protected requests
- Normalize error handling
- Keep page components focused on UI logic

### Auth State Handling
Use a simple React auth context or equivalent lightweight global state.

Store:
- JWT token
- current user
- auth loading state

Recommended behavior:
- Save token in local storage for MVP simplicity
- On app load, read token and fetch `/auth/me`
- If token is invalid, clear auth state and redirect to login when needed

## 5. Backend Architecture

### Folder / Module Structure
Suggested backend structure:

```text
src/
  app.ts
  server.ts
  config/
    env.ts
    data-source.ts
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
  entities/
    User.ts
    Club.ts
    Event.ts
    RSVP.ts
  middleware/
    auth.middleware.ts
    role.middleware.ts
    error.middleware.ts
  utils/
    api-error.ts
    async-handler.ts
```

This keeps modules grouped by responsibility while still remaining lightweight.

### Routes
Routes should be thin and only connect middleware to controllers.

Examples:
- auth routes for register, login, me
- club routes for list and detail
- event routes for listing, detail, create, update, delete
- RSVP routes for RSVP create and cancel

### Controllers
Controllers should:
- Read request params/body
- Call services
- Return JSON responses
- Avoid embedding business rules

### Services
Services should contain:
- registration logic
- login logic
- event ownership checks
- RSVP duplicate prevention
- event retrieval and formatting logic

This is where most application rules should live.

### Entities
TypeORM entities should map directly to:
- `users`
- `clubs`
- `events`
- `rsvps`

### Middleware
Minimum middleware needed:
- JWT auth middleware
- role check middleware for admin-only routes
- centralized error middleware
- request validation middleware

### Validation
Use request validation for:
- registration
- login
- event create
- event update
- route params where needed

Validation should happen before controllers execute service logic.

### Error Handling
Use centralized error handling for:
- validation errors
- unauthorized access
- forbidden actions
- not found resources
- duplicate RSVP attempts
- unexpected server errors

Response style should be consistent JSON, for example:
- `message`
- `errors` when relevant

## 6. Database Design

The MVP database includes four tables only.

### `users`
Fields:
- `id` UUID primary key
- `name` varchar, required
- `email` varchar, required, unique
- `password_hash` varchar, required
- `role` enum or varchar, required
- `club_id` UUID, nullable for students, required for `club_admin`
- `created_at` timestamp
- `updated_at` timestamp

Rules:
- `role` values are `student` or `club_admin`
- Students must have `club_id = NULL`
- Club admins must have a valid `club_id`

Relationship:
- Many users may belong to one club only if they are admins in future expansions, but for MVP the practical rule is one admin user is assigned one club

### `clubs`
Fields:
- `id` UUID primary key
- `name` varchar, required, unique
- `description` text, required
- `category` varchar, required
- `contact_email` varchar, nullable
- `created_at` timestamp
- `updated_at` timestamp

Relationship:
- One club has many events
- One club may be associated with a club admin through `users.club_id`

### `events`
Fields:
- `id` UUID primary key
- `club_id` UUID, required
- `created_by` UUID, required
- `title` varchar, required
- `description` text, required
- `event_date` date, required
- `start_time` time, required
- `end_time` time, nullable
- `venue` varchar, required
- `category` varchar, required
- `created_at` timestamp
- `updated_at` timestamp

Rules:
- Events are visible immediately after creation
- No draft or status column is needed in MVP

Relationships:
- Many events belong to one club
- Many events are created by one user
- One event has many RSVPs

### `rsvps`
Fields:
- `id` UUID primary key
- `event_id` UUID, required
- `user_id` UUID, required
- `created_at` timestamp

Relationships:
- Many RSVPs belong to one event
- Many RSVPs belong to one user

Important Constraint:
- Unique composite constraint on `(event_id, user_id)`

This enforces the locked rule that a student cannot RSVP to the same event more than once.

### Important Relationships Summary
- `users.club_id -> clubs.id`
- `events.club_id -> clubs.id`
- `events.created_by -> users.id`
- `rsvps.event_id -> events.id`
- `rsvps.user_id -> users.id`

## 7. Authorization Model

### Student Permissions
Students can:
- Register
- Log in
- View clubs
- View events
- View event details
- RSVP to events
- Cancel their own RSVP

Students cannot:
- Create events
- Edit events
- Delete events
- Access admin pages

### Club Admin Permissions
Club admins can:
- Log in
- View clubs and events
- Access admin event dashboard
- Create events for their assigned club
- Edit events for their assigned club
- Delete events for their assigned club
- View RSVP counts on their managed events

Club admins cannot:
- Manage events for another club
- Reassign club ownership

### Ownership Check Using `users.club_id`
This is the key MVP authorization rule.

When a `club_admin` performs an event management action:
1. Read the authenticated user from JWT
2. Read the user's `club_id`
3. Compare that `club_id` to the event's `club_id` or the create payload's `club_id`
4. Allow the action only if they match

Recommended simplification:
- For create event requests, do not let the frontend choose an arbitrary `club_id`
- The backend should derive the event's `club_id` from the authenticated admin's `users.club_id`

This keeps the ownership model simple and secure.

## 8. Core Data Flows

### Student Registration / Login
1. Student submits registration form
2. Backend validates input
3. Backend creates user with role `student` and `club_id = NULL`
4. Password is hashed before storage
5. Student logs in
6. Backend validates credentials and returns JWT
7. Frontend stores token and fetches current user profile

### Student Browsing Events
1. Frontend requests upcoming events
2. Backend queries events where event date is upcoming
3. Backend joins club data and RSVP count as needed
4. Frontend renders event cards
5. Student opens event detail page
6. Frontend requests event detail
7. Backend returns event data, hosting club, RSVP count, and whether current user has RSVP'd if authenticated

### Student RSVP Flow
1. Authenticated student clicks RSVP on event detail page
2. Frontend sends protected RSVP request
3. Backend verifies JWT
4. Backend checks event exists
5. Backend checks user role is allowed to RSVP
6. Backend checks `(event_id, user_id)` does not already exist
7. Backend creates RSVP
8. Backend returns updated success response and RSVP count

Cancel flow:
1. Student clicks cancel RSVP
2. Frontend sends protected delete request
3. Backend verifies ownership of the RSVP by current user
4. Backend deletes RSVP
5. Backend returns updated success response and RSVP count

### Club Admin Create Event Flow
1. Club admin opens admin dashboard
2. Frontend loads events for the admin's club
3. Admin opens create event form
4. Frontend submits protected create request
5. Backend verifies JWT and role `club_admin`
6. Backend reads `club_id` from authenticated user, not from arbitrary client input
7. Backend validates event payload
8. Backend creates event with:
   - `club_id = currentUser.club_id`
   - `created_by = currentUser.id`
9. Event becomes visible immediately

### Club Admin Edit / Delete Event Flow
1. Admin selects an event from their dashboard
2. Frontend sends protected update or delete request
3. Backend verifies JWT and admin role
4. Backend loads event by id
5. Backend compares `event.club_id` with `currentUser.club_id`
6. If they match, action is allowed
7. Backend updates or deletes the event
8. Frontend refreshes the dashboard list

## 9. API Direction

The MVP API should stay minimal and resource-oriented.

### Auth
- `POST /api/auth/register`
  - Public
  - Creates student account only

- `POST /api/auth/login`
  - Public

- `GET /api/auth/me`
  - Protected
  - Returns current authenticated user

### Clubs
- `GET /api/clubs`
  - Public
  - Returns all clubs

- `GET /api/clubs/:id`
  - Public
  - Returns club detail

### Events
- `GET /api/events`
  - Public
  - Returns upcoming events

- `GET /api/events/:id`
  - Public
  - Returns event detail plus RSVP count

- `POST /api/events`
  - Protected
  - `club_admin` only

- `PUT /api/events/:id`
  - Protected
  - `club_admin` only

- `DELETE /api/events/:id`
  - Protected
  - `club_admin` only

### RSVPs
- `POST /api/events/:id/rsvp`
  - Protected
  - Student RSVP action

- `DELETE /api/events/:id/rsvp`
  - Protected
  - Student cancel RSVP action

### Admin Convenience Endpoint
Optional but practical for the MVP:
- `GET /api/admin/events`
  - Protected
  - `club_admin` only
  - Returns events for the authenticated admin's club

This endpoint is useful because it keeps the admin dashboard simple and avoids exposing unnecessary management complexity to the client.

## 10. Deployment Architecture

### Frontend Deployment
Deploy the React frontend as a static site on a service such as:
- Vercel
- Netlify

### Backend Deployment
Deploy the Express API on a Node-compatible hosting platform such as:
- Render
- Railway
- Fly.io

### Database Hosting
Host PostgreSQL on:
- Neon
- Supabase Postgres
- Render Postgres

### Environment Variables
Recommended backend variables:
- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`

Recommended frontend variables:
- `VITE_API_BASE_URL` or equivalent

### Frontend-Backend Communication in Production
- Frontend sends requests to the deployed API base URL
- Backend enables CORS for the deployed frontend origin
- JWT is sent in the `Authorization: Bearer <token>` header for protected routes

## 11. Key Technical Decisions and Justifications

### React + Tailwind CSS
This is a strong MVP frontend combination because it allows fast UI development, responsive layouts, and straightforward component styling without a heavy design system investment.

### Node.js + Express
Express is lightweight and familiar, which fits a solo sprint build well. It provides enough structure for REST APIs without forcing unnecessary complexity.

### TypeORM
TypeORM works well for a relational MVP where entities and relationships are central. It gives a clean entity-based model and supports migrations for PostgreSQL.

### PostgreSQL
PostgreSQL is a good fit because the data is relational and constrained:
- users belong to roles
- events belong to clubs
- RSVPs connect users to events

This is better suited to SQL than a document database.

### JWT Authentication
JWT is appropriate for a simple client-server MVP because:
- it is easy to integrate with React and Express
- it avoids session-store setup
- it works well for protected API routes

### `users.club_id` Instead of a `club_admins` Table
This is one of the most important MVP simplifications.
- fewer tables
- simpler authorization logic
- faster implementation
- easier seed/setup for club admins

### No Search, Filters, or Draft Workflow
These are intentionally excluded because they do not change the core value of the MVP. Removing them reduces both backend and frontend complexity.

### Minimal Admin Dashboard
A minimal dashboard keeps the admin experience useful without turning the MVP into a management platform. It stays focused on event CRUD only.

## 12. Architecture Summary

Club & Event Hub will be implemented as a React frontend, an Express REST API, and a PostgreSQL database connected through TypeORM. The frontend handles user interaction and page rendering, the backend enforces business rules and authorization, and PostgreSQL stores users, clubs, events, and RSVPs.

The architecture is intentionally simple:
- student registration only through public signup
- manual assignment of club admins
- one club per club admin
- immediate event publishing
- no extra workflow states
- no search, filters, or non-essential pages

This gives a clean and professional MVP that is realistic to build in a short sprint while leaving clear room for future growth.
