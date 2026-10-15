import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[API ERROR] ${req.method} ${req.url}:`, err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Erreur serveur inattendue",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}
