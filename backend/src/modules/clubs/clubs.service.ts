import { MoreThanOrEqual } from "typeorm";

import { AppDataSource } from "../../config/data-source";
import { Club } from "../../entities/Club";
import { Event } from "../../entities/Event";
import { ApiError } from "../../utils/ApiError";

type ClubSummary = {
  id: string;
  name: string;
  description: string;
  category: string;
  contactEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ClubEventSummary = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string | null;
  venue: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

type ClubDetail = ClubSummary & {
  upcomingEvents: ClubEventSummary[];
};

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getClubRepository() {
  return AppDataSource.getRepository(Club);
}

function getEventRepository() {
  return AppDataSource.getRepository(Event);
}

function serializeClub(club: Club): ClubSummary {
  return {
    id: club.id,
    name: club.name,
    description: club.description,
    category: club.category,
    contactEmail: club.contactEmail,
    createdAt: club.createdAt,
    updatedAt: club.updatedAt,
  };
}

function serializeClubEvent(event: Event): ClubEventSummary {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime,
    venue: event.venue,
    category: event.category,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

async function listClubs(): Promise<ClubSummary[]> {
  const clubs = await getClubRepository().find({
    order: { name: "ASC" },
  });

  return clubs.map(serializeClub);
}

async function getClubDetail(id: string): Promise<ClubDetail> {
  const club = await getClubRepository().findOne({
    where: { id },
  });

  if (!club) {
    throw new ApiError(404, "Club not found.");
  }

  const upcomingEvents = await getEventRepository().find({
    where: {
      clubId: club.id,
      eventDate: MoreThanOrEqual(getTodayDateString()),
    },
    order: {
      eventDate: "ASC",
      startTime: "ASC",
    },
  });

  return {
    ...serializeClub(club),
    upcomingEvents: upcomingEvents.map(serializeClubEvent),
  };
}

export const clubsService = {
  listClubs,
  getClubDetail,
};
