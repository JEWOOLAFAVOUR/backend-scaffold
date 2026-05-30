import argon2 from "argon2";
import { AppError, ERROR_CODES } from "../types/response.types";
import { withTransaction } from "../database/connection";
import { userRepository } from "../repositories/user.repository";
import { userSecurityRepository } from "../repositories/usersecurity.repository";
import { UserPublicDTO } from "../types/user.types";


export const authService = {
  async login(params: {
    email: string;
    password: string;
  }): Promise<UserPublicDTO> {
    const normalizedEmail = params.email.trim().toLowerCase();

    return withTransaction(async (client) => {
      const user = await userRepository.findByEmail(normalizedEmail, client);

      if (!user || user.deleted_at) {
        throw new AppError({
          code: ERROR_CODES.UNAUTHORIZED,
          message: "Invalid email or password",
          statusCode: 401,
        });
      }

      if (user.status !== "active") {
        throw new AppError({
          code: ERROR_CODES.FORBIDDEN,
          message: "Your account is not active. Please contact support.",
          statusCode: 403,
        });
      }

      const security = await userSecurityRepository.findByUserId(
        user.id,
        client,
      );

      if (!security) {
        throw new AppError({
          code: ERROR_CODES.UNAUTHORIZED,
          message: "Invalid email or password",
          statusCode: 401,
        });
      }

      let passwordMatches = false;
      try {
        passwordMatches = await argon2.verify(
          security.password_hash,
          params.password,
        );
      } catch (err) {
        passwordMatches = false;
      }
      if (!passwordMatches) {
        await client.query(
          `UPDATE user_security
            SET failed_login_count = failed_login_count + 1,
            updated_at = now()
            WHERE user_id = $1`,
          [user.id],
        );
        throw new AppError({
          code: ERROR_CODES.UNAUTHORIZED,
          message: "Invalid email or password",
          statusCode: 401,
        });
      }

      await client.query(
        `UPDATE users
        SET last_login_at = now(),
        updated_at = now()
        WHERE id = $1`,
        [user.id],
      );

      await client.query(
        `UPDATE user_security
        SET failed_login_count = 0,
        updated_at = now()
        WHERE user_id = $1`,
        [user.id],
      );

      return {
        id: user.id,
        email: user.email,
        first_name: undefined,
        last_name: undefined,
        avatar_url: null,
        status: user.status,
        created_at: user.created_at,
      };
    });
  },
};
