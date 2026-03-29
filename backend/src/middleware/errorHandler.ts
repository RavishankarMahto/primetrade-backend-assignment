import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isAppError } from "../utils/errors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: err.flatten(),
      },
    });
  }

  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code ?? "APP_ERROR",
        message: err.message,
      },
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}
