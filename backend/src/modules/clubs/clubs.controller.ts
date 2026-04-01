import { Request, Response } from "express";

import { sendSuccess } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { clubsService } from "./clubs.service";

const listClubs = asyncHandler(async (_req: Request, res: Response) => {
  const clubs = await clubsService.listClubs();

  sendSuccess(res, {
    message: "Clubs fetched successfully.",
    data: clubs,
  });
});

const getClubDetail = asyncHandler(async (req: Request, res: Response) => {
  const club = await clubsService.getClubDetail(String(req.params.id));

  sendSuccess(res, {
    message: "Club fetched successfully.",
    data: club,
  });
});

export const clubsController = {
  listClubs,
  getClubDetail,
};
