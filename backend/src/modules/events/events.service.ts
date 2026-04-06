import { MoreThanOrEqual } from "typeorm";

import { AppDataSource } from "../../config/data-source";
import { Club } from "../../entities/Club";
import { Event } from "../../entities/Event";
import { RSVP } from "../../entities/RSVP";
import { UserRole } from "../../entities/User";
import { ApiError } from "../../utils/ApiError";
import type { CreateEventInput, UpdateEventInput } from "./events.validation";

type AuthenticatedUser = {
  id: string;
  role: "student" | "club_admin";
  clubId: string | null;
};

type EventClubSummary = {
  id: string;
  name: string;
  category: string;
  contactEmail: string | null;
};

type EventListResponse = {
  id: string;
  clubId: string;
  createdBy: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  club: EventClubSummary;
};

type EventResponse = EventListResponse & {
  highlights: string[];
  targetAudience: string[];
  additionalInfo: string | null;
};

type EventDetailResponse = EventResponse & {
  rsvpCount: number;
  hasRsvped: boolean | null;
};

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getEventRepository() {
  return AppDataSource.getRepository(Event);
}

function getClubRepository() {
  return AppDataSource.getRepository(Club);
}

function getRsvpRepository() {
  return AppDataSource.getRepository(RSVP);
}

function serializeEventListItem(
  event: Event,
): EventListResponse {
  return {
    id: event.id,
    clubId: event.clubId,
    createdBy: event.createdBy,
    title: event.title,
    description: event.description,
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    venue: event.venue,
    category: event.category,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
    club: {
      id: event.club.id,
      name: event.club.name,
      category: event.club.category,
      contactEmail: event.club.contactEmail,
    },
  };
}

function serializeEvent(
  event: Event,
): EventResponse {
  return {
    ...serializeEventListItem(event),
    highlights: event.highlights ?? [],
    targetAudience: event.targetAudience ?? [],
    additionalInfo: event.additionalInfo ?? null,
  };
}

async function ensureAdminClub(clubId: string | null): Promise<Club> {
  if (!clubId) {
    throw new ApiError(403, "This admin account is not linked to a club.");
  }

  const club = await getClubRepository().findOne({
    where: { id: clubId },
  });

  if (!club) {
    throw new ApiError(404, "Assigned club was not found.");
  }

  return club;
}

async function findEventOrThrow(id: string): Promise<Event> {
  const event = await getEventRepository().findOne({
    where: { id },
    relations: {
      club: true,
    },
  });

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return event;
}

function ensureEventOwnership(event: Event, currentUser: AuthenticatedUser): void {
  if (!currentUser.clubId || event.clubId !== currentUser.clubId) {
    throw new ApiError(403, "You do not have permission to manage this event.");
  }
}

function ensureEventTimeRange(startTime: string, endTime: string | null): void {
  if (endTime && endTime <= startTime) {
    throw new ApiError(400, "End time must be later than start time.");
  }
}

async function listUpcomingEvents(): Promise<EventListResponse[]> {
  const events = await getEventRepository().find({
    where: {
      eventDate: MoreThanOrEqual(getTodayDateString()),
    },
    relations: {
      club: true,
    },
    order: {
      eventDate: "ASC",
      startTime: "ASC",
    },
  });

  return events.map(serializeEventListItem);
}

async function getEventDetail(
  id: string,
  currentUser?: AuthenticatedUser,
): Promise<EventDetailResponse> {
  const event = await findEventOrThrow(id);
  const rsvpRepository = getRsvpRepository();

  const rsvpCount = await rsvpRepository.count({
    where: { eventId: event.id },
  });

  let hasRsvped: boolean | null = null;

  if (
    currentUser &&
    (currentUser.role === UserRole.STUDENT || currentUser.role === UserRole.CLUB_ADMIN)
  ) {
    const existingRsvp = await rsvpRepository.findOne({
      where: {
        eventId: event.id,
        userId: currentUser.id,
      },
    });

    hasRsvped = Boolean(existingRsvp);
  }

  return {
    ...serializeEvent(event),
    rsvpCount,
    hasRsvped,
  };
}

async function createEvent(payload: CreateEventInput, currentUser: AuthenticatedUser): Promise<EventResponse> {
  const club = await ensureAdminClub(currentUser.clubId);
  const eventRepository = getEventRepository();
  const endTime = payload.endTime ?? null;

  ensureEventTimeRange(payload.startTime, endTime);

  const event = eventRepository.create({
    clubId: club.id,
    createdBy: currentUser.id,
    title: payload.title.trim(),
    description: payload.description.trim(),
    eventDate: payload.eventDate,
    startTime: payload.startTime,
    endTime,
    venue: payload.venue.trim(),
    category: payload.category.trim(),
    highlights: payload.highlights,
    targetAudience: payload.targetAudience,
    additionalInfo: payload.additionalInfo ?? null,
  });

  const savedEvent = await eventRepository.save(event);
  savedEvent.club = club;

  return serializeEvent(savedEvent);
}

async function updateEvent(
  id: string,
  payload: UpdateEventInput,
  currentUser: AuthenticatedUser,
): Promise<EventResponse> {
  const eventRepository = getEventRepository();
  const existingEvent = await findEventOrThrow(id);

  ensureEventOwnership(existingEvent, currentUser);

  const nextStartTime = payload.startTime ?? existingEvent.startTime;
  const nextEndTime = payload.endTime !== undefined ? payload.endTime ?? null : existingEvent.endTime;

  ensureEventTimeRange(nextStartTime, nextEndTime);

  if (payload.title !== undefined) {
    existingEvent.title = payload.title.trim();
  }

  if (payload.description !== undefined) {
    existingEvent.description = payload.description.trim();
  }

  if (payload.eventDate !== undefined) {
    existingEvent.eventDate = payload.eventDate;
  }

  if (payload.startTime !== undefined) {
    existingEvent.startTime = payload.startTime;
  }

  if (payload.endTime !== undefined) {
    existingEvent.endTime = payload.endTime ?? null;
  }

  if (payload.venue !== undefined) {
    existingEvent.venue = payload.venue.trim();
  }

  if (payload.category !== undefined) {
    existingEvent.category = payload.category.trim();
  }

  if (payload.highlights !== undefined) {
    existingEvent.highlights = payload.highlights;
  }

  if (payload.targetAudience !== undefined) {
    existingEvent.targetAudience = payload.targetAudience;
  }

  if (payload.additionalInfo !== undefined) {
    existingEvent.additionalInfo = payload.additionalInfo ?? null;
  }

  const updatedEvent = await eventRepository.save(existingEvent);

  return serializeEvent(updatedEvent);
}

async function deleteEvent(id: string, currentUser: AuthenticatedUser): Promise<void> {
  const eventRepository = getEventRepository();
  const existingEvent = await findEventOrThrow(id);

  ensureEventOwnership(existingEvent, currentUser);

  await eventRepository.remove(existingEvent);
}

async function listAdminEvents(currentUser: AuthenticatedUser): Promise<EventResponse[]> {
  const club = await ensureAdminClub(currentUser.clubId);

  const events = await getEventRepository().find({
    where: {
      clubId: club.id,
    },
    relations: {
      club: true,
    },
    order: {
      eventDate: "ASC",
      startTime: "ASC",
    },
  });

  return events.map(serializeEvent);
}

export const eventsService = {
  listUpcomingEvents,
  getEventDetail,
  createEvent,
  updateEvent,
  deleteEvent,
  listAdminEvents,
};
