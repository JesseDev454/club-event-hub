import { Request, Response } from "express";

import { ApiError } from "../../utils/ApiError";
import { sendSuccess } from "../../utils/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";
import type { LoginInput, RegisterInput } from "./auth.validation";

const register = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as RegisterInput;
  const result = await authService.registerStudent(payload);

  sendSuccess(res, {
    statusCode: 201,
    message: "Student account created successfully.",
    data: result,
  });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as LoginInput;
  const result = await authService.loginUser(payload);

  sendSuccess(res, {
    message: "Login successful.",
    data: result,
  });
});

const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new ApiError(401, "Authentication is required.");
  }

  const user = await authService.getCurrentUser(req.user.id);

  sendSuccess(res, {
    message: "Authenticated user fetched successfully.",
    data: user,
  });
});

export const authController = {
  register,
  login,
  me,
};
