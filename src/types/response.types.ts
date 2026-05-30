export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export type ApiResponse<T = any> =
  | {
      success: true;
      data: T;
      timestamp: string;
    }
  | {
      sucess: false;
      error: {
        code: ErrorCode;
        message: string;
        details?: unknown;
      };
      timestamp: string;
    };

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(params: {
    code: ErrorCode;
    message: string;
    statusCode: number;
    details?: unknown;
  }) {
    super(params.message);
    this.code = params.code;
    this.statusCode = params.statusCode;
    this.details = params.details;
  }

  static validation(message: string, details?: unknown): AppError {
    return new AppError({
      code: ERROR_CODES.VALIDATION_ERROR,
      message,
      statusCode: 400,
      details,
    });
  }

  static conflict(message: string, details?: unknown): AppError {
    return new AppError({
      code: ERROR_CODES.CONFLICT,
      message,
      statusCode: 409,
      details,
    });
  }

  static internal(
    message = "An unexpected error occurred",
    details?: unknown,
  ): AppError {
    return new AppError({
      code: ERROR_CODES.INTERNAL_ERROR,
      message,
      statusCode: 500,
      details,
    });
  }
}
