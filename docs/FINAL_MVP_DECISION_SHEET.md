# Club & Event Hub

## Final MVP Decision Sheet

This document locks the MVP decisions for implementation. The goal is to keep the product professional, consistent, and realistic for a solo developer working within a short sprint.

## 1. Role Assignment

### Decision
`club_admin` must be assigned manually. Users do not choose `club_admin` during public registration.

### Why
This is the safest and simplest MVP option.
- It prevents anyone from self-registering as a club admin
- It removes the need for approval workflows during registration
- It keeps the public signup flow very simple

### MVP Rule
- Public registration creates `student` accounts only
- `club_admin` accounts are created or updated manually in the database or by a seed/admin setup step

## 2. Club Admin Ownership Model

### Decision
Each club admin manages exactly one club in the MVP.

### Why
This is the simplest practical ownership model.
- Authorization becomes much easier
- Database relationships stay simple
- Admin screens can focus on one club context

### MVP Rule
- One `club_admin` user is linked to one club
- A club admin can only create, edit, and delete events for their assigned club

## 3. Event Publishing Workflow

### Decision
Events are published immediately when created. No draft, published, or cancelled workflow in MVP.

### Why
This is the simplest correct option for a sprint build.
- Fewer fields and fewer edge cases
- No extra moderation or status logic
- Simpler event queries and UI

### MVP Rule
- When an admin creates an event, it becomes visible immediately
- If an event should no longer appear, the admin edits or deletes it

## 4. Search and Filtering

### Decision
Search and filtering are not part of the MVP. They are a bonus only.

### Why
The platform still solves the core problem without them.
- Basic list pages are enough for an MVP
- Search adds UI and query complexity
- Filters introduce extra product decisions that are not essential yet

### MVP Rule
- Clubs are shown in a simple list
- Events are shown in a simple upcoming-events list sorted by nearest date

## 5. My RSVPs Page

### Decision
`My RSVPs` is out of scope for the MVP.

### Why
Students can still complete the core use case without a separate RSVP history page.
- It avoids one extra page and endpoint
- The core RSVP action still works from the event detail page
- It is easy to add later if time remains

### MVP Rule
- Students can RSVP and cancel RSVP from the event detail page
- No dedicated RSVP history page is required for first release

## 6. Admin Dashboard

### Decision
The admin dashboard should be a minimal event management page only.

### Minimum MVP Version
- Show a list of events for the admin's club
- Show key columns: title, date, venue, RSVP count
- Provide actions: `Create`, `Edit`, `Delete`

### What It Should Not Include
- Analytics
- Charts
- Club profile management
- Multi-club switching
- Approval queues
- Advanced filtering

### Why
This gives admins the exact controls they need without adding management overhead.

## 7. Database Simplification

### Decision
Do not use a separate `club_admins` table in the MVP.

### Better MVP Option
Add `club_id` directly to the `users` table for users with the `club_admin` role.

### Why
This matches the chosen one-admin-to-one-club ownership model.
- Fewer tables
- Simpler queries
- Simpler backend authorization checks
- Easier seed data setup

### MVP Data Rule
- `users.role` is either `student` or `club_admin`
- `users.club_id` is `NULL` for students
- `users.club_id` is required for club admins

## 8. Final Locked MVP Scope

### Included in MVP
- Public registration for student accounts
- Login and logout
- Role support for `student` and `club_admin`
- Manual assignment of `club_admin` accounts
- Club listing page
- Club detail page
- Upcoming events listing page
- Event detail page
- RSVP from event detail page
- RSVP cancellation from event detail page
- Duplicate RSVP prevention
- RSVP counts on events
- Club admin create event
- Club admin edit own club's events
- Club admin delete own club's events
- Minimal admin dashboard for event management
- Input validation
- Secure password hashing
- Backend role-based access control
- Responsive UI

### Out of Scope
- Public self-selection of `club_admin` role
- Multi-club admin ownership
- Draft, published, cancelled event states
- Search
- Filtering
- My RSVPs page
- Payments
- QR attendance check-in
- Chat
- Notifications
- Analytics
- AI recommendations
- Event approval workflow
- Recurring events
- Media uploads

### Deferred but Easy to Add Later
- Search by club name or event title
- Filter events by category
- Filter events by date
- `My RSVPs` page
- Event status field
- Past events archive
- Club profile editing
- Admin support for managing multiple clubs
- Event images

## Final MVP Shape

The MVP should feel like a clean campus directory plus event board:
- Students can sign up, browse, view event details, and RSVP
- Club admins can log in and manage event listings for one club
- The system avoids extra workflows, extra roles, and extra state management

This is the recommended MVP baseline for a short sprint build.
