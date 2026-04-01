import { NextFunction, Request, Response } from "express";

import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import { authService } from "../modules/auth/auth.service";

async function resolveRequestUser(req: Request, options: { required: boolean }): Promise<void> {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    if (options.required) {
      throw new ApiError(401, "Authentication token is missing.");
    }

    return;
  }

  if (!authorizationHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is missing.");
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    throw new ApiError(401, "Authentication token is missing.");
  }

  const decoded = authService.verifyAuthToken(token);
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new ApiError(401, "Authenticated user no longer exists.");
  }

  req.user = {
    id: user.id,
    role: user.role,
    clubId: user.clubId,
  };
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    await resolveRequestUser(req, { required: true });
    next();
  } catch (error) {
    req.user = undefined;
    next();
  }
}

export async function attachOptionalUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await resolveRequestUser(req, { required: false });
    next();
  } catch (error) {
    req.user = undefined;
    next();
  }
}

