import type { AuthTokenPayload } from "../config";

declare module "express-serve-static-core" {
  interface Request {
    auth?: AuthTokenPayload;
  }
}

export {};
