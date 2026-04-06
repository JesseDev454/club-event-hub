import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { UserRole } from "../../entities/User";
import { clubIdSchema, createClubSchema, updateClubSchema } from "./clubs.validation";
import { clubsController } from "./clubs.controller";

const clubsRouter = Router();

clubsRouter.get("/", clubsController.listClubs);
clubsRouter.post(
  "/",
  requireAuth,
  requireRole([UserRole.STUDENT]),
  validate(createClubSchema),
  clubsController.createClub,
);
clubsRouter.patch(
  "/:id",
  requireAuth,
  requireRole([UserRole.CLUB_ADMIN]),
  validate(updateClubSchema),
  clubsController.updateClub,
);
clubsRouter.get("/:id", validate(clubIdSchema), clubsController.getClubDetail);

export { clubsRouter };
