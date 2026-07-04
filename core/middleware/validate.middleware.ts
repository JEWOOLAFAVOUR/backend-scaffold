import { NextFunction, Request, Response } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { AppError } from "../errors";

const formatZodError = (error: ZodError) => {
  const details = error.issues.map((issue) => {
    if (issue.code === "unrecognized_keys") {
      return {
        path: issue.path.join("."),
        message: `Unexpected fields: ${(issue.keys ?? []).join(", ")}`,
      };
    }

    return {
      path: issue.path.join("."),
      message: issue.message,
    };
  });

  return details;
};

export const validate =
  (schema: ZodTypeAny, customMessage?: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const details = formatZodError(parsed.error);

      next(
        AppError.validation(
          customMessage ?? "Request body validation failed",
          details,
        ),
      );
      return;
    }

    req.body = parsed.data;
    next();
  };
