import { NextFunction, Request, Response } from "express";
import { AppError, ApiResponse } from "../types/response.types";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse);
  }
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An upexpecred error occured",
    },
    timestamp: new Date().toISOString(),
  } as ApiResponse);
};
