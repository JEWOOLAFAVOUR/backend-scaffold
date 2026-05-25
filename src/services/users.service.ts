import { randomUUID, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { AppError } from "../types/response.types";
import { userRepository } from "../repositories/user.repository";

const scrypt = promisify(scryptCallback);

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

const hashPassword = async (password: string): Promise<string> => {
  const salt = randomUUID();
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
};

export const userService = {
  async register(params: RegisterUserParams): Promise<UserPublic> {
    const normalizedEmail = params.email.trim().toLowerCase();

    const existing = await userRepository.findByEmail(normalizedEmail);
    if (existing) {
      throw AppError.conflict("Email is already registered", {
        field: "email",
      });
    }

    const password_hash = await hashPassword(params.password);

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
