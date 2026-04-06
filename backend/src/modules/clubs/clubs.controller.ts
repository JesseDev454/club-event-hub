import { Request, Response } from "express";

import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import type { CreateClubInput, UpdateClubInput } from "./clubs.validation";
import { clubsService } from "./clubs.service";

function getAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new ApiError(401, "Authentication is required.");
  }

  return req.user;
}

const listClubs = asyncHandler(async (_req: Request, res: Response) => {
  const clubs = await clubsService.listClubs();

  sendSuccess(res, {
    message: "Clubs fetched successfully.",
    data: clubs,
  });
});

const getAdminClub = asyncHandler(async (req: Request, res: Response) => {
  const club = await clubsService.getAdminClub(getAuthenticatedUser(req));

  sendSuccess(res, {
    message: "Admin club fetched successfully.",
    data: club,
  });
});

const createClub = asyncHandler(async (req: Request, res: Response) => {
  const result = await clubsService.createClub(
    req.body as CreateClubInput,
    getAuthenticatedUser(req),
  );

  sendSuccess(res, {
    statusCode: 201,
    message: "Club created successfully.",
    data: result,
  });
});

const getClubDetail = asyncHandler(async (req: Request, res: Response) => {
  const club = await clubsService.getClubDetail(String(req.params.id));

  sendSuccess(res, {
    message: "Club fetched successfully.",
    data: club,
  });
});

const updateClub = asyncHandler(async (req: Request, res: Response) => {
  const club = await clubsService.updateClub(
    String(req.params.id),
    req.body as UpdateClubInput,
    getAuthenticatedUser(req),
  );

  sendSuccess(res, {
    message: "Club updated successfully.",
    data: club,
  });
});

export const clubsController = {
  listClubs,
  getAdminClub,
  createClub,
  getClubDetail,
  updateClub,
};
