import { Request, Response } from "express";

import { UserRole } from "../../entities/User";
import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { rsvpsService } from "./rsvps.service";

function getAuthenticatedRsvpUser(req: Request) {
  if (!req.user) {
    throw new ApiError(401, "Authentication is required.");
  }

  if (![UserRole.STUDENT, UserRole.CLUB_ADMIN].includes(req.user.role)) {
    throw new ApiError(403, "Only students and club admins can RSVP to events.");
  }

  return req.user;
}

const createRsvp = asyncHandler(async (req: Request, res: Response) => {
  const result = await rsvpsService.createRsvp(String(req.params.id), getAuthenticatedRsvpUser(req));

  sendSuccess(res, {
    statusCode: 201,
    message: "RSVP created successfully.",
    data: result,
  });
});

const cancelRsvp = asyncHandler(async (req: Request, res: Response) => {
  const result = await rsvpsService.cancelRsvp(String(req.params.id), getAuthenticatedRsvpUser(req));

  sendSuccess(res, {
    message: "RSVP cancelled successfully.",
    data: result,
  });
});

export const rsvpsController = {
  createRsvp,
  cancelRsvp,
};
