import { Response } from "express";

type SuccessResponseOptions<T> = {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
};

export function sendSuccess<T>(
  res: Response,
  { statusCode = 200, message = "Success.", data = null as T, meta }: SuccessResponseOptions<T>,
): Response {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}
