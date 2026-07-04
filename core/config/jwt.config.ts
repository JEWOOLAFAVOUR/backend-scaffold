import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "./app.config";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  status: string;
};

export const signAuthToken = (payload: AuthTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as AuthTokenPayload;
};
