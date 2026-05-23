import { ZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../types/response.types";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body) as any;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues.map((i) => i.message).join("; ");
        throw new AppError(message, "VALIDATION_ERROR", 400);
      }
      next(err);
    }
  };
