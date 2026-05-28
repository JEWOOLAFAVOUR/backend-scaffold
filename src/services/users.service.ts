import { randomUUID, scrypt as scryptCallback } from "crypto";
import { promisify } from "util";
import { AppError } from "../types/response.types";
import { withTransaction } from "../database/connection";
import { userRepository } from "../repositories/user.repository";
import { userProfileRepository } from "../repositories/userprofile.repository";
import { userSecurityRepository } from "../repositories/usersecurity.repository";
import { UserPublicDTO } from "../types/user.types";

const scrypt = promisify(scryptCallback);

const hashPassword = async (password: string): Promise<string> => {
  const salt = randomUUID();
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
};

export const userService = {
  async register(params: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }): Promise<UserPublicDTO> {
    const normalizedEmail = params.email.trim().toLowerCase();

    return withTransaction(async (client) => {
      const existingUser = await userRepository.findByEmail(
        normalizedEmail,
        client,
      );
      if (existingUser)
        throw AppError.conflict("Email is already registered", {
          field: "email",
        });

      const createdUser = await userRepository.createReturningId(
        { email: normalizedEmail },
        client,
      );

      const password_hash = await hashPassword(params.password);

      await userSecurityRepository.create(
        {
          user_id: createdUser.id,
          password_hash,
          two_factor_enabled: false,
        },
        client,
      );

      await userProfileRepository.create(
        {
          user_id: createdUser.id,
          first_name: params.first_name,
          last_name: params.last_name,
        },
        client,
      );

      return {
        id: createdUser.id,
        email: normalizedEmail,
        first_name: params.first_name,
        last_name: params.last_name,
        status: "active",
        created_at: createdUser.created_at,
      } as UserPublicDTO;
    });
  },
};
