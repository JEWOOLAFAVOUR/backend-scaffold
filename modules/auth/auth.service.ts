import argon2 from "argon2";
import { withTransaction } from "../../core/database";
import { AppError, ERROR_CODES } from "../../core/errors";
import { signAuthToken } from "../../core/config";
import { LoginResponse, RegisterResponse } from "./auth.types";
import { userRepository } from "./user.repository";

const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
};

export const authService = {
  async register(params: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }): Promise<RegisterResponse> {
    const normalizedEmail = params.email.trim().toLowerCase();

    return withTransaction(async (client) => {
      const existingUser = await userRepository.findByEmail(
        normalizedEmail,
        client,
      );
      if (existingUser) {
        throw AppError.conflict("Email is already registered", {
          field: "email",
        });
      }

      const createdUser = await userRepository.createReturningId(
        {
          email: params.email,
          email_normalized: normalizedEmail,
          first_name: params.first_name,
          last_name: params.last_name,
        },
        client,
      );

      const password_hash = await hashPassword(params.password);

      await userRepository.createSecurity(
        {
          user_id: createdUser.id,
          password_hash,
        },
        client,
      );

      return {
        id: createdUser.id,
        email: params.email,
        first_name: params.first_name,
        last_name: params.last_name,
        status: "active",
        created_at: createdUser.created_at,
      };
    });
  },

  async login(params: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
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

      const security = await userRepository.findSecurityByUserId(user.id, client);

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
      } catch {
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

      const accessToken = signAuthToken({
        sub: user.id,
        email: user.email,
        status: user.status,
      });

      return {
        access_token: accessToken,
        token_type: "Bearer",
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name ?? null,
          last_name: user.last_name ?? null,
          avatar_url: user.avatar_url ?? null,
          status: user.status,
          created_at: user.created_at,
        },
      };
    });
  },
};
