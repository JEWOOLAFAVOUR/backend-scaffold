import { ZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../types/response.types";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      next(AppError.validation("Request body validation failed", details));
      return;
    }

    req.body = parsed.data;
    next();
  };
