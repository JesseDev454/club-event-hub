import { Router } from "express";

import { authRouter } from "../modules/auth/auth.routes";
import { clubsRouter } from "../modules/clubs/clubs.routes";
import { eventsRouter } from "../modules/events/events.routes";
import { usersRouter } from "../modules/users/users.routes";
import { healthRouter } from "./health.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/clubs", clubsRouter);
apiRouter.use("/events", eventsRouter);

export { apiRouter };
