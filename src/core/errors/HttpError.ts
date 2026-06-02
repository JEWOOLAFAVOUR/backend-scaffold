import { AppError, ERROR_CODES } from "./AppError";

export class HttpError extends AppError {
  constructor(statusCode: number, message: string, details?: unknown) {
    super({
      code:
        statusCode === 404 ? ERROR_CODES.NOT_FOUND : ERROR_CODES.INTERNAL_ERROR,
      message,
      statusCode,
      details,
    });
  }
}
