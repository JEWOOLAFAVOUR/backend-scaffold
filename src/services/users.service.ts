import { withTransaction } from "../database/connection";
import { userRepository } from "../repositories/user.repository";
import { userSecurityRepository } from "../repositories/userSecurity.repository";
import { userProfileRepository } from "../repositories/userProfile.repository";
import { AppError } from "../types/response.types";

export const userService = {
  async register(params: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }) {
    return withTransaction(async (client) => {
      // use repository functions that accept client to run within same tx
      const normalizedEmail = params.email.trim().toLowerCase();
      const existing = await userRepository.findByEmailClient(
        client,
        normalizedEmail,
      );
      if (existing)
        throw AppError.conflict("Email is already registered", {
          field: "email",
        });

      const createdUser = await userRepository.createClient(client, {
        email: normalizedEmail,
        first_name: first_name,
        last_name: last_name,
      });

      await userSecurityRepository.createClient(client, {
        user_id: createdUser.id,
        password_hash: "salted-hash",
      });

      await userProfileRepository.createClient(client, {
        user_id: createdUser.id,
        first_name: first_name,
        last_name: last_name,
      });

      return {
        id: createdUser.id,
        email: createdUser.email,
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        created_at: createdUser.created_at,
      };
    });
  },
};
