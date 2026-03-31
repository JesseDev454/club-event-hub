import { Router } from "express";

import { sendSuccess } from "../utils/apiResponse";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  sendSuccess(res, {
    message: "Club & Event Hub backend is running.",
    data: {
      status: "ok",
    },
  });
});

export { healthRouter };
