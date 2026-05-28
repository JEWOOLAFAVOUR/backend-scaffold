import { NextFunction, Request, Response } from "express";
import { AppError, ApiResponse, ERROR_CODES } from "../types/response.types";

type JsonParseError = SyntaxError & {
  status?: number;
  statusCode?: number;
  type?: string;
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
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

  const parseErr = err as JsonParseError;
  if (parseErr?.type === "entity.parse.failed") {
    console.warn(
      `[INVALID_JSON] ${req.method} ${req.path}: Malformed JSON body`,
    );
    return res.status(400).json({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: "Malformed JSON in request body",
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
