import { QueryFailedError } from "typeorm";

import { AppDataSource } from "../../config/data-source";
import { Event } from "../../entities/Event";
import { RSVP } from "../../entities/RSVP";
import { UserRole } from "../../entities/User";
import { ApiError } from "../../utils/ApiError";

type AuthenticatedUser = {
  id: string;
  role: UserRole;
  clubId: string | null;
};

type RsvpResponse = {
  eventId: string;
  rsvpCount: number;
  hasRsvped: boolean;
};

function getEventRepository() {
  return AppDataSource.getRepository(Event);
}

function getRsvpRepository() {
  return AppDataSource.getRepository(RSVP);
}

async function findEventOrThrow(id: string): Promise<Event> {
  const event = await getEventRepository().findOne({
    where: { id },
  });

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return event;
}

function ensureRsvpEligibleUser(currentUser: AuthenticatedUser): void {
  if (![UserRole.STUDENT, UserRole.CLUB_ADMIN].includes(currentUser.role)) {
    throw new ApiError(403, "You do not have permission to RSVP to events.");
  }
}

async function buildRsvpResponse(eventId: string, userId: string): Promise<RsvpResponse> {
  const rsvpRepository = getRsvpRepository();
  const [rsvpCount, existingRsvp] = await Promise.all([
    rsvpRepository.count({
      where: { eventId },
    }),
    rsvpRepository.findOne({
      where: {
        eventId,
        userId,
      },
    }),
  ]);

  return {
    eventId,
    rsvpCount,
    hasRsvped: Boolean(existingRsvp),
  };
}

async function createRsvp(eventId: string, currentUser: AuthenticatedUser): Promise<RsvpResponse> {
  ensureRsvpEligibleUser(currentUser);
  await findEventOrThrow(eventId);

  const rsvpRepository = getRsvpRepository();
  const existingRsvp = await rsvpRepository.findOne({
    where: {
      eventId,
      userId: currentUser.id,
    },
  });

  if (existingRsvp) {
    throw new ApiError(409, "You have already RSVP'd to this event.");
  }

  try {
    await rsvpRepository.save(
      rsvpRepository.create({
        eventId,
        userId: currentUser.id,
      }),
    );
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === "23505"
    ) {
      throw new ApiError(409, "You have already RSVP'd to this event.");
    }

    throw error;
  }

  return buildRsvpResponse(eventId, currentUser.id);
}

async function cancelRsvp(eventId: string, currentUser: AuthenticatedUser): Promise<RsvpResponse> {
  ensureRsvpEligibleUser(currentUser);
  await findEventOrThrow(eventId);

  const rsvpRepository = getRsvpRepository();
  const existingRsvp = await rsvpRepository.findOne({
    where: {
      eventId,
      userId: currentUser.id,
    },
  });

  if (existingRsvp) {
    await rsvpRepository.remove(existingRsvp);
  }

  return buildRsvpResponse(eventId, currentUser.id);
}

export const rsvpsService = {
  createRsvp,
  cancelRsvp,
};
