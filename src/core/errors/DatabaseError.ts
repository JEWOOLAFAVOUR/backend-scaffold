import { AppError, ERROR_CODES } from "./AppError";

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed", details?: unknown) {
    super({
      code: ERROR_CODES.INTERNAL_ERROR,
      message,
      statusCode: 500,
      details,
    });
  }
}
