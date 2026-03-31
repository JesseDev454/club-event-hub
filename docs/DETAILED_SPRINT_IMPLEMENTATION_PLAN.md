# Club & Event Hub

## Detailed Sprint-by-Sprint Implementation Plan

This plan breaks the MVP into practical, dependency-aware sprints for a solo developer. It follows the locked product and architecture decisions exactly and prioritizes shipping a complete working MVP over optional features.

---

## Sprint 0 - Planning and Project Setup

### 1. Sprint Goal
Set up the project foundations so development can move quickly and consistently in later sprints.

### 2. Why This Sprint Matters
This sprint reduces setup friction and avoids rework later. A clean project structure, database setup, and shared conventions make every later sprint faster and safer.

### 3. Backend Tasks
- Initialize the backend project with Node.js, Express, TypeScript, and TypeORM
- Create the backend folder structure based on the final architecture
- Set up core configuration files
- Configure environment variable loading
- Set up PostgreSQL connection through TypeORM
- Configure TypeORM entities and migration support
- Add base Express app setup
- Add global error handling structure
- Add a basic health check route
- Define shared response and error conventions

### 4. Frontend Tasks
- Initialize the React project
- Install and configure Tailwind CSS
- Set up frontend folder structure
- Set up routing
- Create a minimal layout shell and navigation structure
- Create placeholder pages for the main routes
- Set up API client base configuration

### 5. Database Work
- Create the PostgreSQL database
- Configure the initial TypeORM data source
- Define the initial entity plan for:
  - `users`
  - `clubs`
  - `events`
  - `rsvps`
- Generate initial migration support
- Decide seed strategy for clubs and admin account setup

### 6. API Endpoints Involved
- `GET /api/health` or equivalent health check

### 7. Validation / Authorization Rules
- No major business authorization yet
- Define the shared validation approach to be used in future sprints
- Define the JWT strategy and protected route pattern

### 8. Testing Focus
- Verify backend starts successfully
- Verify frontend starts successfully
- Verify database connection works
- Verify migration setup works
- Verify health endpoint responds

### 9. Deliverables
- Running backend project skeleton
- Running frontend project skeleton
- PostgreSQL connection configured
- Initial folder/module structure in place
- Tailwind configured
- Environment variable templates created
- Health endpoint working

### 10. Exit Criteria
- Backend server boots without errors
- Frontend app boots without errors
- Database connection is confirmed
- Project structure matches the architecture plan
- The codebase is ready for auth implementation

### 11. Risks / Notes
- Avoid spending too long polishing project structure
- Keep the frontend layout minimal for now
- Do not build business logic yet
- Confirm that local environment setup is reproducible

---

## Sprint 1 - Authentication and Core Backend Foundation

### 1. Sprint Goal
Implement secure authentication and the backend foundation needed for protected features.

### 2. Why This Sprint Matters
Authentication is a blocker for RSVP and admin event management. This sprint establishes the user model, JWT flow, and role-based access control needed by the rest of the MVP.

### 3. Backend Tasks
- Implement the `users` entity
- Implement the `auth` module:
  - register student
  - login user
  - get current authenticated user
- Add password hashing
- Add JWT creation and verification
- Add auth middleware to decode and verify tokens
- Add role middleware for admin-only routes
- Implement basic `users` service for current user access
- Define consistent auth response shape
- Add user registration rule so public signup always creates `student`
- Support manual seed/setup for `club_admin` user(s)

### 4. Frontend Tasks
- Build `RegisterPage`
- Build `LoginPage`
- Build auth forms with validation feedback
- Create auth context or equivalent auth state manager
- Store JWT in local storage
- Fetch `/auth/me` on app initialization
- Add protected route handling
- Add role-protected route handling for admin pages
- Update navigation to reflect logged-in state

### 5. Database Work
- Finalize and migrate the `users` table
- Include fields:
  - `id`
  - `name`
  - `email`
  - `password_hash`
  - `role`
  - `club_id`
  - timestamps
- Seed at least:
  - sample student account
  - sample club(s)
  - at least one `club_admin` account with `club_id`

### 6. API Endpoints Involved
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### 7. Validation / Authorization Rules
- Registration:
  - require name, email, password
  - email must be unique
  - role must not be user-selectable from public registration
  - created user role must always be `student`
  - created user `club_id` must be `NULL`
- Login:
  - require valid email and password
- Auth middleware:
  - reject missing or invalid JWT
- Role middleware:
  - restrict admin-only routes to `club_admin`
- Data integrity rule:
  - `club_admin` users must have a valid `club_id`

### 8. Testing Focus
- Registration success and failure cases
- Duplicate email prevention
- Password hashing verification
- Login success and invalid credential handling
- Token verification behavior
- `/auth/me` behavior for valid and invalid tokens
- Frontend auth persistence across refresh

### 9. Deliverables
- Fully working auth flow
- Protected route middleware
- Role middleware
- Auth screens connected to backend
- Seeded student and admin test accounts

### 10. Exit Criteria
- A student can register and log in
- A seeded club admin can log in
- JWT-protected requests work
- The frontend correctly identifies whether the user is authenticated and whether they are an admin
- Auth is stable enough for later feature sprints

### 11. Risks / Notes
- Keep auth simple; do not add password reset or email verification
- Avoid overbuilding user profile features
- Make seed accounts easy to use during development and demo

---

## Sprint 2 - Clubs and Events

### 1. Sprint Goal
Build the core browsing experience for clubs and events, plus admin event CRUD.

### 2. Why This Sprint Matters
This sprint delivers the main product value: students can discover clubs and events, and admins can publish event listings. Once this sprint is complete, the platform already feels like a real campus discovery app.

### 3. Backend Tasks
- Implement the `clubs` module:
  - list clubs
  - get club detail
- Implement the `events` module:
  - list upcoming events
  - get event detail
  - create event
  - update event
  - delete event
- Implement admin convenience endpoint for dashboard event listing
- Ensure event creation uses the authenticated admin's `club_id`
- Ensure event detail includes hosting club information
- Ensure upcoming events are sorted by nearest date
- Exclude past events from the default events list

### 4. Frontend Tasks
- Build `ClubsPage`
- Build `ClubDetailPage`
- Build `EventsPage`
- Build `EventDetailPage`
- Build `AdminEventsPage`
- Build `AdminCreateEventPage`
- Build `AdminEditEventPage`
- Build reusable `ClubCard`, `EventCard`, and `EventForm`
- Connect public read pages to backend data
- Connect admin event CRUD pages to backend endpoints

### 5. Database Work
- Finalize and migrate the `clubs` table
- Finalize and migrate the `events` table
- Create relationships:
  - `users.club_id -> clubs.id`
  - `events.club_id -> clubs.id`
  - `events.created_by -> users.id`
- Seed enough clubs and events for development and demo

### 6. API Endpoints Involved
- `GET /api/clubs`
- `GET /api/clubs/:id`
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`
- `GET /api/admin/events`

### 7. Validation / Authorization Rules
- Club routes are public read-only
- Event listing and detail routes are public read-only
- Event creation and update require:
  - authenticated user
  - role `club_admin`
  - valid title, description, date, start time, venue, category
- Event deletion requires:
  - authenticated user
  - role `club_admin`
- Ownership rules:
  - admin may create events only for their own club
  - admin may edit events only when `event.club_id === currentUser.club_id`
  - admin may delete events only when `event.club_id === currentUser.club_id`
- Client must not control event ownership

### 8. Testing Focus
- Clubs list and detail retrieval
- Event list returns only upcoming events
- Event detail returns correct data
- Admin create event success and validation failure cases
- Admin update and delete ownership enforcement
- Admin cannot manage another club's events
- Frontend CRUD flow for admin pages

### 9. Deliverables
- Public club listing and club detail pages
- Public events listing and event detail pages
- Admin event dashboard
- Admin create/edit/delete event flow
- Seed data that supports a realistic demo

### 10. Exit Criteria
- Students can browse clubs and upcoming events without logging in
- Event detail pages load correctly
- Club admins can create, edit, and delete events for their own club only
- Admin dashboard shows events for the current admin's club

### 11. Risks / Notes
- Do not add search or filtering
- Do not add event status workflow
- Keep event forms minimal and clean
- Ensure date handling is consistent across backend and frontend

---

## Sprint 3 - RSVP Functionality

### 1. Sprint Goal
Add RSVP and RSVP cancellation so students can interact with events beyond browsing.

### 2. Why This Sprint Matters
RSVP is the main student action in the MVP. It transforms the app from a passive event board into an actual participation platform.

### 3. Backend Tasks
- Implement the `rsvps` module
- Add RSVP creation endpoint
- Add RSVP cancellation endpoint
- Add duplicate RSVP prevention logic
- Add RSVP count support for event detail and event list responses where appropriate
- Add logic to detect whether the current authenticated student has RSVP'd to an event
- Ensure only the current user can cancel their own RSVP

### 4. Frontend Tasks
- Add RSVP action to `EventDetailPage`
- Add cancel RSVP action to `EventDetailPage`
- Display RSVP count on event cards and event detail page
- Show different UI states:
  - unauthenticated user
  - authenticated student who has not RSVP'd
  - authenticated student who has RSVP'd
  - admin viewing the page
- Add loading and error handling around RSVP actions

### 5. Database Work
- Finalize and migrate the `rsvps` table
- Add foreign keys:
  - `rsvps.event_id -> events.id`
  - `rsvps.user_id -> users.id`
- Add unique composite constraint on `(event_id, user_id)`

### 6. API Endpoints Involved
- `POST /api/events/:id/rsvp`
- `DELETE /api/events/:id/rsvp`
- `GET /api/events`
- `GET /api/events/:id`

### 7. Validation / Authorization Rules
- RSVP create requires:
  - authenticated user
  - valid event id
  - event exists
- RSVP cancellation requires:
  - authenticated user
  - existing RSVP owned by current user
- Duplicate prevention:
  - same user cannot RSVP twice to the same event
- Recommended MVP authorization rule:
  - only `student` users can RSVP and cancel RSVP
- Club admins may still view event details and RSVP counts, but not RSVP through the MVP interface

### 8. Testing Focus
- RSVP success path
- Duplicate RSVP prevention
- RSVP cancellation success path
- Unauthorized RSVP attempts
- RSVP count accuracy after create and delete
- Event detail reflects RSVP state correctly
- Frontend button state updates correctly after RSVP actions

### 9. Deliverables
- Working RSVP backend
- RSVP button on event detail page
- Cancel RSVP action on event detail page
- Accurate RSVP counts in UI

### 10. Exit Criteria
- Authenticated students can RSVP to an event
- Authenticated students can cancel their RSVP
- Duplicate RSVP is blocked
- RSVP counts remain correct after repeated test flows

### 11. Risks / Notes
- Keep RSVP as a simple binary action only
- Do not add waitlists, attendance states, or reminders
- Be careful about race conditions; database uniqueness is the final safeguard

---

## Sprint 4 - Frontend Integration and MVP Polish

### 1. Sprint Goal
Integrate all frontend flows cleanly and polish the MVP so it feels complete, consistent, and demo-ready.

### 2. Why This Sprint Matters
By this point, the core features should exist. This sprint turns separate features into a cohesive product experience with better usability, responsiveness, and visual consistency.

### 3. Backend Tasks
- Clean up response consistency across modules
- Improve error message clarity for frontend handling
- Review validation coverage across all endpoints
- Ensure route protection is applied consistently
- Fix any integration bugs discovered during frontend testing

### 4. Frontend Tasks
- Refine page layouts and spacing
- Improve navigation and role-aware menu behavior
- Add loading, empty, and error states across major pages
- Improve form UX for auth and admin event forms
- Improve mobile responsiveness
- Ensure admin dashboard is easy to use and visually clean
- Ensure event detail page communicates RSVP state clearly
- Remove placeholder content and connect all production routes

### 5. Database Work
- Review migrations for completeness
- Confirm seed data supports demo scenarios
- Verify referential integrity and delete/update behavior

### 6. API Endpoints Involved
- All MVP endpoints are exercised in this sprint

### 7. Validation / Authorization Rules
- Recheck every protected route
- Recheck ownership checks for admin event actions
- Recheck student-only RSVP rule
- Ensure public registration still creates student accounts only
- Ensure club admin role is not exposed in registration UI or payloads

### 8. Testing Focus
- Full end-to-end user flows:
  - student register -> login -> browse -> RSVP -> cancel RSVP
  - admin login -> create event -> edit event -> delete event
- Responsive behavior on desktop and mobile sizes
- Error state handling
- Route guard behavior
- Cross-page consistency

### 9. Deliverables
- Fully integrated frontend
- Improved UI polish
- Responsive MVP experience
- Stable end-to-end flows

### 10. Exit Criteria
- A demo user can complete the key student flow without confusion
- A demo admin can complete event management flow without confusion
- The app looks coherent and responsive
- No critical integration bugs remain

### 11. Risks / Notes
- Avoid over-polishing visuals at the expense of stability
- Keep the admin dashboard intentionally minimal
- Do not add bonus pages or scope creep during polish

---

## Sprint 5 - Deployment, Documentation, and Final Submission Prep

### 1. Sprint Goal
Deploy the MVP, document the project clearly, and prepare it for presentation or submission.

### 2. Why This Sprint Matters
An MVP is only complete when it can be run, explained, and evaluated easily. This sprint makes the project accessible to reviewers and ensures the work is presentable.

### 3. Backend Tasks
- Prepare production configuration
- Configure CORS for deployed frontend origin
- Confirm environment variable usage
- Run final migration checks against hosted database
- Smoke test deployed API

### 4. Frontend Tasks
- Configure production API base URL
- Build and deploy the frontend
- Smoke test deployed routes and auth flow
- Verify responsive behavior in deployed environment

### 5. Database Work
- Provision hosted PostgreSQL instance
- Apply migrations in hosted environment
- Seed essential clubs, admin account, and sample events
- Verify production data integrity

### 6. API Endpoints Involved
- All MVP endpoints should be tested in deployed form

### 7. Validation / Authorization Rules
- Confirm protected routes behave correctly in production
- Confirm JWT secret and environment variables are correctly configured
- Confirm public registration still creates only student accounts
- Confirm admin event ownership checks still work in deployed environment

### 8. Testing Focus
- Production smoke tests for all major flows
- Environment variable correctness
- Cross-origin request behavior
- Database migration reliability
- Final demo readiness

### 9. Deliverables
- Deployed frontend
- Deployed backend API
- Hosted PostgreSQL database
- Updated README with setup and deployment notes
- Demo credentials or seeded accounts for reviewer testing
- Final project summary and submission checklist

### 10. Exit Criteria
- The app is accessible through live URLs
- Core MVP flows work in production
- Documentation is clear enough for another person to run or review the project
- Submission materials are complete

### 11. Risks / Notes
- Leave enough buffer time for deployment issues
- Keep deployment simple; avoid custom infrastructure
- Make sure secrets are not committed
- Use clear seed/demo data so the final presentation is easy to understand

---

## Recommended Overall Work Order

1. Finish setup before writing business features
2. Complete auth before building protected functionality
3. Complete event browsing and admin CRUD before RSVP
4. Add RSVP only after event detail flow is stable
5. Reserve polish and deployment for the end

This order keeps dependencies clean and reduces the chance of rework.

## Recommended MVP Completion Check

By the end of Sprint 5, the project should support:
- student registration and login
- public browsing of clubs and upcoming events
- event detail viewing
- student RSVP and RSVP cancellation
- RSVP counts
- admin login
- admin event create, edit, and delete for one assigned club
- a minimal admin event dashboard
- responsive UI
- live deployment

Anything beyond this should be treated as optional and only attempted if all exit criteria are already met.
