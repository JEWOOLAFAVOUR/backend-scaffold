import cors from "cors";
import helmet from "helmet";
import type { RequestHandler } from "express";

export const securityMiddleware: RequestHandler[] = [
  helmet(),
  cors({
    origin: true,
    credentials: true,
  }),
];

export const jsonBodyParser = {
  limit: "100kb",
};
