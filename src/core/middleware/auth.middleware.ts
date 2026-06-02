import { Request, Response, NextFunction } from "express";
import { AppError, ERROR_CODES } from "../errors";
import { verifyAuthToken, type AuthTokenPayload } from "../config";

type AuthenticatedRequest = Request & {
  auth?: AuthTokenPayload;
};

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(
      new AppError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Missing or invalid Authorization token",
        statusCode: 401,
      }),
    );
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    req.auth = verifyAuthToken(token);
    next();
  } catch {
    next(
      new AppError({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Invalid or expired token",
        statusCode: 401,
      }),
    );
  }
};
