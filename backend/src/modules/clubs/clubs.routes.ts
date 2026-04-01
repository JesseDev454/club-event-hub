import { Router } from "express";
import { z } from "zod";

import { validate } from "../../middleware/validate.middleware";
import { clubsController } from "./clubs.controller";

const clubIdParamsSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().uuid("Club id must be a valid UUID."),
  }),
  query: z.object({}).default({}),
});

const clubsRouter = Router();

clubsRouter.get("/", clubsController.listClubs);
clubsRouter.get("/:id", validate(clubIdParamsSchema), clubsController.getClubDetail);

export { clubsRouter };
