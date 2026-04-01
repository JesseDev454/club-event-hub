import { MoreThanOrEqual } from "typeorm";

import { AppDataSource } from "../../config/data-source";
import { Club } from "../../entities/Club";
import { Event } from "../../entities/Event";
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

type EventResponse = {
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

function serializeEvent(event: Event): EventResponse {
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

async function listUpcomingEvents(): Promise<EventResponse[]> {
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

  return events.map(serializeEvent);
}

async function getEventDetail(id: string): Promise<EventResponse> {
  const event = await findEventOrThrow(id);
  return serializeEvent(event);
}

async function createEvent(payload: CreateEventInput, currentUser: AuthenticatedUser): Promise<EventResponse> {
  const club = await ensureAdminClub(currentUser.clubId);
  const eventRepository = getEventRepository();

  const event = eventRepository.create({
    clubId: club.id,
    createdBy: currentUser.id,
    title: payload.title.trim(),
    description: payload.description.trim(),
    eventDate: payload.eventDate,
    startTime: payload.startTime,
    endTime: payload.endTime ?? null,
    venue: payload.venue.trim(),
    category: payload.category.trim(),
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
