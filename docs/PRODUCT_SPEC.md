# Club & Event Hub

## Product Specification

### Product Summary
Club & Event Hub is a campus web application that helps students discover active clubs and upcoming events in one place. It also gives club admins a simple way to publish and manage event listings so campus activities are easier to find and attend.

### Problem
Students often miss campus events because information is scattered across group chats, flyers, and social media. They also may not know which clubs are active. This product creates a single, reliable place to browse clubs, view events, and RSVP.

### Target Users
- Students
- Club admins

### Primary Goals
- Help students discover clubs on campus
- Help students discover upcoming events quickly
- Allow students to view event details and RSVP
- Allow club admins to create and manage event listings
- Keep the experience simple, responsive, and easy to maintain

### Core User Flows
#### Student Flow
1. Register or log in
2. Browse clubs
3. Browse upcoming events
4. Open an event detail page
5. RSVP or cancel RSVP

#### Club Admin Flow
1. Log in
2. View events for their club
3. Create a new event
4. Edit an existing event
5. Delete an outdated event
6. View RSVP counts

### Functional Requirements
#### Authentication and Roles
- Users must be able to register with email and password
- Users must be able to log in and log out
- The system must support two roles: `student` and `club_admin`
- Passwords must be stored securely using hashing

#### Clubs
- The system must display a list of clubs
- Each club must have a profile with at least name, description, and category
- Users must be able to open a club detail view

#### Events
- The system must display a list of upcoming events
- Each event must show:
  - title
  - description
  - date
  - time
  - venue
  - category
  - hosting club
- Users must be able to open an event detail view

#### RSVP
- Authenticated students must be able to RSVP to an event
- Students must be able to cancel an RSVP
- The system must prevent duplicate RSVPs for the same event by the same user
- The system must display RSVP counts for each event

#### Club Admin Event Management
- Club admins must be able to create events
- Club admins must be able to edit events they created or are authorized to manage
- Club admins must be able to delete events they created or are authorized to manage
- Club admins must be able to view RSVP counts for their events

### Business Rules
- Only authenticated users can RSVP to events
- Only users with the `club_admin` role can create, edit, or delete events
- A club admin can manage only events for clubs they are assigned to
- A user can RSVP only once per event
- Upcoming events should be sorted by nearest date first
- Past events should not appear in the default upcoming events list

### Non-Functional Requirements
- The interface should be simple and responsive on desktop and mobile
- Backend input validation must be enforced for all write operations
- Role-based access control must be enforced on the backend
- The codebase should be modular and maintainable
- Error responses should be clear enough for frontend handling

### Assumptions for MVP
- Authentication will use email and password only
- Clubs are created through seed data or admin setup, not by public users
- Event categories use a fixed predefined list
- RSVP is binary: attending or not attending
- No image upload is required for the first release

## MVP Scope

### Included in MVP
- User registration
- User login and logout
- Role support for `student` and `club_admin`
- Club listing page
- Club detail page
- Upcoming events listing page
- Event detail page
- Student RSVP and RSVP cancellation
- Duplicate RSVP prevention
- RSVP counts
- Club admin event create, edit, and delete
- Basic admin dashboard for managing events

### Out of Scope for MVP
- Payments
- QR code attendance check-in
- In-app chat
- Push notifications
- Advanced analytics
- AI recommendations
- Event approval workflows
- Recurring events
- Public club creation
- Rich media management

## Main Pages and Screens

### Public and Shared Pages
- `Home`
  - Intro to the platform
  - Entry points to clubs and events
- `Register`
  - Name, email, password, role handling
- `Login`
  - Email and password sign-in

### Student-Facing Pages
- `Clubs List`
  - Browse all clubs
- `Club Detail`
  - Club information and upcoming events by that club
- `Events List`
  - Browse upcoming events
- `Event Detail`
  - Full event information and RSVP action
- `My RSVPs`
  - List of events the student has RSVP'd to

### Club Admin Pages
- `Admin Events Dashboard`
  - View and manage events for assigned club(s)
- `Create Event`
  - Form to add a new event
- `Edit Event`
  - Form to update existing event details

## Core Backend Modules

### `auth`
- Register user
- Log in user
- Hash and verify passwords
- Issue and validate auth tokens or sessions

### `users`
- Fetch current user profile
- Retrieve role information

### `clubs`
- List clubs
- Fetch club details
- Fetch events for a specific club

### `events`
- List upcoming events
- Fetch event details
- Create event
- Update event
- Delete event

### `rsvps`
- Create RSVP
- Cancel RSVP
- Count RSVPs per event
- Check whether a user has already RSVP'd

### `authorization`
- Enforce role-based access control
- Enforce club ownership or assignment rules for admins

### `validation`
- Validate registration input
- Validate login input
- Validate event creation and update payloads
- Validate RSVP actions

### `shared/infrastructure`
- Database access
- Error handling
- Configuration management
- Logging

## Database Entities

### `users`
- `id`
- `name`
- `email`
- `password_hash`
- `role`
- `created_at`
- `updated_at`

### `clubs`
- `id`
- `name`
- `description`
- `category`
- `contact_email`
- `created_at`
- `updated_at`

### `club_admins`
- `id`
- `user_id`
- `club_id`
- `created_at`

Purpose:
Maps admin users to the clubs they are allowed to manage.

### `events`
- `id`
- `club_id`
- `created_by`
- `title`
- `description`
- `event_date`
- `start_time`
- `end_time`
- `venue`
- `category`
- `status`
- `created_at`
- `updated_at`

Notes:
- `created_by` references the user who created the event
- `status` can support values such as `draft`, `published`, or `cancelled` if needed

### `rsvps`
- `id`
- `event_id`
- `user_id`
- `created_at`

Constraint:
- Unique composite constraint on `(event_id, user_id)` to prevent duplicate RSVPs

## API Direction for MVP

This is not a full API contract yet, but the expected backend capabilities are:

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Clubs
- `GET /clubs`
- `GET /clubs/:id`
- `GET /clubs/:id/events`

### Events
- `GET /events`
- `GET /events/:id`
- `POST /events`
- `PUT /events/:id`
- `DELETE /events/:id`

### RSVPs
- `POST /events/:id/rsvp`
- `DELETE /events/:id/rsvp`

## Recommended Build Order

1. Confirm product rules that affect backend design
2. Design the database schema and relationships
3. Set up backend project structure, config, and database migrations
4. Implement authentication and password hashing
5. Implement role-based authorization and admin ownership checks
6. Build club listing and event listing read APIs
7. Build event detail and RSVP APIs
8. Build admin event create, edit, and delete APIs
9. Build frontend pages in the order: auth, browse, event details, RSVP, admin management
10. Add validation, responsive polish, and tests

## Suggested Success Criteria for MVP
- A student can create an account, log in, browse clubs, browse events, view event details, RSVP, and cancel RSVP
- A club admin can log in, create an event, edit it, delete it, and view RSVP counts
- The backend prevents unauthorized event management actions
- The backend prevents duplicate RSVPs
- The application works cleanly on desktop and mobile screens

## Open Decisions Before Development
- Whether role selection happens at registration or is assigned by an administrator
- Whether club admins can manage one club or multiple clubs
- Whether events need a `draft` state or should be published immediately
- Whether the MVP needs search and filtering in clubs and events lists
- Whether past events should have a separate archive page later
