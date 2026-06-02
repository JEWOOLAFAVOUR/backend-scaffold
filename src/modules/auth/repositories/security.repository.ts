import { PoolClient } from "pg";
import { pool } from "../../../core/config";
import { UserSecurityRecord } from "../types";

export const securityRepository = {
  async create(
    security: {
      user_id: string;
      password_hash: string;
    },
    client?: PoolClient,
  ): Promise<UserSecurityRecord> {
    const q = `INSERT INTO user_security (user_id, password_hash)
               VALUES ($1,$2)
               ON CONFLICT (user_id) DO UPDATE
                 SET password_hash = EXCLUDED.password_hash,
                     updated_at = now()
               RETURNING id::text AS id, user_id::text AS user_id, password_hash, password_changed_at::text AS password_changed_at, failed_login_count, locked_until::text AS locked_until, created_at, updated_at`;
    const values = [security.user_id, security.password_hash];
    const res = client
      ? await client.query<UserSecurityRecord>(q, values)
      : await pool.query<UserSecurityRecord>(q, values);
    return res.rows[0];
  },

  async findByUserId(
    user_id: string,
    client?: PoolClient,
  ): Promise<UserSecurityRecord | null> {
    const q = `SELECT id::text AS id, user_id::text AS user_id,
                    password_hash,
                    password_changed_at::text AS password_changed_at,
                    failed_login_count,
                    locked_until::text AS locked_until,
                    created_at,
                    updated_at
                FROM user_security
                WHERE user_id = $1
                LIMIT 1`;

    const res = client
      ? await client.query<UserSecurityRecord>(q, [user_id])
      : await pool.query<UserSecurityRecord>(q, [user_id]);

    return res.rows[0] ?? null;
  },
};
