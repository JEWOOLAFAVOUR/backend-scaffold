import { NextFunction, Request, Response } from "express";
import { AppError, ApiResponse, ERROR_CODES } from "../types/response.types";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<ApiResponse> => {
  // console.log("Error", err);

  if (err instanceof AppError) {
    console.warn(`[${err.code}] ${req.method} ${req.path}: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      timestamp: new Date().toISOString(),
    });
  }
  console.error("Unhandled error", {
    method: req.method,
    path: req.path,
    err,
  });

  // will add later there ought to have a console log here to log error for debugging a console from the response

  return res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_ERROR,
      message: "An unexpected error occurred",
    },
    timestamp: new Date().toISOString(),
  });
};
