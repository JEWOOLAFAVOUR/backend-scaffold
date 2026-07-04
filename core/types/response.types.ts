import type { ErrorCode } from "../errors";
export { AppError, ERROR_CODES } from "../errors";

export type ApiResponse<T = any> =
  | {
      success: true;
      data: T;
      timestamp: string;
    }
  | {
      success: false;
      error: {
        code: ErrorCode;
        message: string;
        details?: unknown;
      };
      timestamp: string;
    };
