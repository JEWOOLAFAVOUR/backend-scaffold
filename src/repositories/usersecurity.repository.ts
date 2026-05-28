import { PoolClient } from "pg";
import { pool } from "../database/connection";
import { UserSecurityRecord } from "../types/user.types";

export const userSecurityRepository = {
  async create(
    security: {
      user_id: string;
      password_hash: string;
      two_factor_enabled?: boolean;
    },
    client?: PoolClient,
  ): Promise<UserSecurityRecord> {
    const q = `INSERT INTO user_security (user_id, password_hash, two_factor_enabled)
               VALUES ($1,$2,$3)
               ON CONFLICT (user_id) DO UPDATE
                 SET password_hash = EXCLUDED.password_hash,
                     two_factor_enabled = EXCLUDED.two_factor_enabled,
                     updated_at = now()
               RETURNING user_id::text AS user_id, password_hash, password_changed_at::text AS password_changed_at, two_factor_enabled, failed_login_count, locked_until::text AS locked_until, created_at, updated_at`;
    const values = [
      security.user_id,
      security.password_hash,
      security.two_factor_enabled ?? false,
    ];
    const res = client
      ? await client.query<UserSecurityRecord>(q, values)
      : await pool.query<UserSecurityRecord>(q, values);
    return res.rows[0];
  },
};
