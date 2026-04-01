import { Router } from "express";

import { UserRole } from "../../entities/User";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { rsvpsController } from "./rsvps.controller";
import { eventRsvpSchema } from "./rsvps.validation";

const rsvpsRouter = Router({ mergeParams: true });

rsvpsRouter.post(
  "/",
  requireAuth,
  requireRole([UserRole.STUDENT]),
  validate(eventRsvpSchema),
  rsvpsController.createRsvp,
);

rsvpsRouter.delete(
  "/",
  requireAuth,
  requireRole([UserRole.STUDENT]),
  validate(eventRsvpSchema),
  rsvpsController.cancelRsvp,
);

export { rsvpsRouter };
