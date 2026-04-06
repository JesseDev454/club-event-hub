import { MoreThanOrEqual, QueryFailedError } from "typeorm";

import { AppDataSource } from "../../config/data-source";
import { Club } from "../../entities/Club";
import { Event } from "../../entities/Event";
import { User, UserRole } from "../../entities/User";
import { ApiError } from "../../utils/ApiError";
import { authService } from "../auth/auth.service";
import type { CreateClubInput, UpdateClubInput } from "./clubs.validation";

type ClubSummary = {
  id: string;
  name: string;
  description: string;
  category: string;
  contactEmail: string | null;
  tagline: string | null;
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

type AuthenticatedUser = {
  id: string;
  role: UserRole;
  clubId: string | null;
};

type CreateClubResponse = ReturnType<typeof authService.createAuthResponse> & {
  club: ClubSummary;
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
    contactEmail: club.contactEmail ?? null,
    tagline: club.tagline ?? null,
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

function isUniqueViolation(error: unknown): error is QueryFailedError & {
  driverError?: { code?: string; constraint?: string };
} {
  return (
    error instanceof QueryFailedError &&
    (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === "23505"
  );
}

function mapCreateClubError(error: unknown): never {
  if (isUniqueViolation(error)) {
    const constraint = error.driverError?.constraint;

    if (constraint === "idx_clubs_name_unique") {
      throw new ApiError(409, "A club with this name already exists.");
    }

    if (constraint === "uq_clubs_owner_user_id" || constraint === "uq_users_club_id_not_null") {
      throw new ApiError(409, "You already own or manage a club.");
    }
  }

  throw error;
}

function mapUpdateClubError(error: unknown): never {
  if (isUniqueViolation(error) && error.driverError?.constraint === "idx_clubs_name_unique") {
    throw new ApiError(409, "A club with this name already exists.");
  }

  throw error;
}

async function findClubOrThrow(id: string): Promise<Club> {
  const club = await getClubRepository().findOne({
    where: { id },
  });

  if (!club) {
    throw new ApiError(404, "Club not found.");
  }

  return club;
}

function ensureClubOwnership(club: Club, currentUser: AuthenticatedUser): void {
  if (
    currentUser.role !== UserRole.CLUB_ADMIN ||
    currentUser.clubId !== club.id ||
    club.ownerUserId !== currentUser.id
  ) {
    throw new ApiError(403, "You do not have permission to manage this club.");
  }
}

async function getAdminClub(currentUser: AuthenticatedUser): Promise<ClubSummary> {
  if (currentUser.role !== UserRole.CLUB_ADMIN || !currentUser.clubId) {
    throw new ApiError(403, "You do not have permission to access an admin club.");
  }

  const club = await findClubOrThrow(currentUser.clubId);

  ensureClubOwnership(club, currentUser);

  return serializeClub(club);
}

async function listClubs(): Promise<ClubSummary[]> {
  const clubs = await getClubRepository().find({
    order: { name: "ASC" },
  });

  return clubs.map(serializeClub);
}

async function getClubDetail(id: string): Promise<ClubDetail> {
  const club = await findClubOrThrow(id);

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

async function createClub(
  payload: CreateClubInput,
  currentUser: AuthenticatedUser,
): Promise<CreateClubResponse> {
  const normalizedName = payload.name.trim();
  const normalizedDescription = payload.description.trim();
  const normalizedCategory = payload.category.trim();
  const normalizedTagline = payload.tagline ?? null;

  try {
    const { club, user } = await AppDataSource.transaction(async (transactionalEntityManager) => {
      const clubRepository = transactionalEntityManager.getRepository(Club);
      const userRepository = transactionalEntityManager.getRepository(User);

      const persistedUser = await userRepository.findOne({
        where: { id: currentUser.id },
      });

      if (!persistedUser) {
        throw new ApiError(404, "Authenticated user was not found.");
      }

      if (persistedUser.role !== UserRole.STUDENT) {
        throw new ApiError(403, "Only students can create clubs.");
      }

      if (persistedUser.clubId) {
        throw new ApiError(409, "You already own or manage a club.");
      }

      const [existingOwnedClub, existingNamedClub] = await Promise.all([
        clubRepository.findOne({
          where: { ownerUserId: currentUser.id },
        }),
        clubRepository.findOne({
          where: { name: normalizedName },
        }),
      ]);

      if (existingOwnedClub) {
        throw new ApiError(409, "You already own or manage a club.");
      }

      if (existingNamedClub) {
        throw new ApiError(409, "A club with this name already exists.");
      }

      const club = clubRepository.create({
        name: normalizedName,
        description: normalizedDescription,
        category: normalizedCategory,
        contactEmail: payload.contactEmail,
        tagline: normalizedTagline,
        ownerUserId: currentUser.id,
      });

      const savedClub = await clubRepository.save(club);

      persistedUser.role = UserRole.CLUB_ADMIN;
      persistedUser.clubId = savedClub.id;

      const savedUser = await userRepository.save(persistedUser);

      return {
        club: savedClub,
        user: savedUser,
      };
    });

    const authResponse = authService.createAuthResponse(user);

    return {
      ...authResponse,
      club: serializeClub(club),
    };
  } catch (error) {
    mapCreateClubError(error);
  }
}

async function updateClub(
  id: string,
  payload: UpdateClubInput,
  currentUser: AuthenticatedUser,
): Promise<ClubSummary> {
  const clubRepository = getClubRepository();
  const existingClub = await findClubOrThrow(id);

  ensureClubOwnership(existingClub, currentUser);

  if (payload.name !== undefined) {
    existingClub.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    existingClub.description = payload.description.trim();
  }

  if (payload.category !== undefined) {
    existingClub.category = payload.category.trim();
  }

  if (payload.contactEmail !== undefined) {
    existingClub.contactEmail = payload.contactEmail;
  }

  if (payload.tagline !== undefined) {
    existingClub.tagline = payload.tagline;
  }

  try {
    const updatedClub = await clubRepository.save(existingClub);
    return serializeClub(updatedClub);
  } catch (error) {
    mapUpdateClubError(error);
  }
}

export const clubsService = {
  listClubs,
  getAdminClub,
  getClubDetail,
  createClub,
  updateClub,
};
