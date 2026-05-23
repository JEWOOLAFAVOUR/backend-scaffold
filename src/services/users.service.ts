import { randomUUID, scryptSync } from "crypto";
import { AppError } from "../types/response.types";
import { userRepository } from "../repositories/user.repository";

type RegisterUserParams = {
  email: string;
  name: string;
  password: string;
};

export type UserPublic = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

const hashPassword = (password: string): string => {
  const salt = randomUUID();
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

export const userService = {
  async register(params: RegisterUserParams): Promise<UserPublic> {
    const normalizedEmail = params.email.trim().toLowerCase();

    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw new AppError("Email already in use", "EMAIL_ALREADY_EXISTS", 409);
    }

    const password_hash = hashPassword(params.password);

    const created = await userRepository.create({
      email: normalizedEmail,
      name: params.name.trim(),
      password_hash,
    });
    return {
      id: created.id,
      email: created.email,
      name: created.name,
      created_at: created.created_at,
    };
  },
};
