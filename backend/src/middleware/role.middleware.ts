import { NextFunction, Request, Response } from "express";

import { UserRole } from "../entities/User";
import { ApiError } from "../utils/ApiError";

export function requireRole(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, "Authentication is required."));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, "You do not have permission to perform this action."));
      return;
    }

    next();
  };
}
