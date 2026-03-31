import { NextFunction, Request, Response } from "express";

import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import { authService } from "../modules/auth/auth.service";

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
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

    next();
  } catch (error) {
    next(error);
  }
}
