import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";

export function requireAuth(_req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(501, "Authentication middleware will be implemented in Sprint 1."));
}
