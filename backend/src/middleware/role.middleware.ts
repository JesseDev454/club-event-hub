import { NextFunction, Request, Response } from "express";

import { ApiError } from "../utils/ApiError";

type UserRole = "student" | "club_admin";

export function requireRole(_roles: UserRole[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    next(new ApiError(501, "Role authorization will be implemented in Sprint 1."));
  };
}
