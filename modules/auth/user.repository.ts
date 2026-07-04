import { PoolClient } from "pg";
import { pool } from "../../core/config";
import { UserCoreRecord, UserSecurityRecord } from "./auth.records";

export const userRepository = {
  async findByEmail(
    email_normalized: string,
    client?: PoolClient,
  ): Promise<UserCoreRecord | null> {
    const q = `SELECT id::text, email, email_normalized, status, phone_number, email_verified_at, phone_verified_at, first_name, last_name, avatar_url, date_of_birth::text AS date_of_birth, last_login_at, deleted_at, created_at, updated_at
               FROM users WHERE email_normalized = $1 LIMIT 1`;
    const res = client
      ? await client.query<UserCoreRecord>(q, [email_normalized])
      : await pool.query<UserCoreRecord>(q, [email_normalized]);
    return res.rows[0] ?? null;
  },

  async createReturningId(
    params: {
      email: string;
      email_normalized: string;
      status?: string;
      first_name?: string | null;
      last_name?: string | null;
      avatar_url?: string | null;
      date_of_birth?: string | null;
    },
    client?: PoolClient,
  ): Promise<{ id: string; created_at: string }> {
    const q = `INSERT INTO users (email, email_normalized, status, first_name, last_name, avatar_url, date_of_birth)
               VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id::text, created_at`;
    const values = [
      params.email,
      params.email_normalized,
      params.status ?? "active",
      params.first_name ?? null,
      params.last_name ?? null,
      params.avatar_url ?? null,
      params.date_of_birth ?? null,
    ];
    const res = client
      ? await client.query<{ id: string; created_at: string }>(q, values)
      : await pool.query<{ id: string; created_at: string }>(q, values);
    return res.rows[0];
  },

  async createSecurity(
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

  async findSecurityByUserId(
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