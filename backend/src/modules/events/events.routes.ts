import { Router } from "express";

import { attachOptionalUser, requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { UserRole } from "../../entities/User";
import { rsvpsRouter } from "../rsvps/rsvps.routes";
import { eventsController } from "./events.controller";
import { createEventSchema, eventIdSchema, updateEventSchema } from "./events.validation";

const eventsRouter = Router();
const adminEventsRouter = Router();

eventsRouter.get("/", eventsController.listEvents);
eventsRouter.use("/:id/rsvp", rsvpsRouter);
eventsRouter.get("/:id", validate(eventIdSchema), attachOptionalUser, eventsController.getEventDetail);
eventsRouter.post(
  "/",
  requireAuth,
  requireRole([UserRole.CLUB_ADMIN]),
  validate(createEventSchema),
  eventsController.createEvent,
);
eventsRouter.put(
  "/:id",
  requireAuth,
  requireRole([UserRole.CLUB_ADMIN]),
  validate(updateEventSchema),
  eventsController.updateEvent,
);
eventsRouter.delete(
  "/:id",
  requireAuth,
  requireRole([UserRole.CLUB_ADMIN]),
  validate(eventIdSchema),
  eventsController.deleteEvent,
);

adminEventsRouter.get(
  "/",
  requireAuth,
  requireRole([UserRole.CLUB_ADMIN]),
  eventsController.listAdminEvents,
);

export { eventsRouter, adminEventsRouter };
