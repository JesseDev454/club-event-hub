import { Request, Response } from "express";

import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import type { CreateEventInput, UpdateEventInput } from "./events.validation";
import { eventsService } from "./events.service";

function getAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new ApiError(401, "Authentication is required.");
  }

  return req.user;
}

const listEvents = asyncHandler(async (_req: Request, res: Response) => {
  const events = await eventsService.listUpcomingEvents();

  sendSuccess(res, {
    message: "Upcoming events fetched successfully.",
    data: events,
  });
});

const getEventDetail = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventsService.getEventDetail(String(req.params.id));

  sendSuccess(res, {
    message: "Event fetched successfully.",
    data: event,
  });
});

const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventsService.createEvent(
    req.body as CreateEventInput,
    getAuthenticatedUser(req),
  );

  sendSuccess(res, {
    statusCode: 201,
    message: "Event created successfully.",
    data: event,
  });
});

const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventsService.updateEvent(
    String(req.params.id),
    req.body as UpdateEventInput,
    getAuthenticatedUser(req),
  );

  sendSuccess(res, {
    message: "Event updated successfully.",
    data: event,
  });
});

const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await eventsService.deleteEvent(String(req.params.id), getAuthenticatedUser(req));

  sendSuccess(res, {
    message: "Event deleted successfully.",
    data: null,
  });
});

const listAdminEvents = asyncHandler(async (req: Request, res: Response) => {
  const events = await eventsService.listAdminEvents(getAuthenticatedUser(req));

  sendSuccess(res, {
    message: "Admin events fetched successfully.",
    data: events,
  });
});

export const eventsController = {
  listEvents,
  getEventDetail,
  createEvent,
  updateEvent,
  deleteEvent,
  listAdminEvents,
};
