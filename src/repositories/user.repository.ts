import { PoolClient } from "pg";
import { pool } from "../database/connection";
import { UserCoreRecord } from "../types/user.types";

export const userRepository = {
  async findByEmail(
    email: string,
    client?: PoolClient,
  ): Promise<UserCoreRecord | null> {
    const q = `SELECT id::text, email, status, phone_number, email_verified_at, phone_verified_at, last_login_at, deleted_at, created_at, updated_at
               FROM users WHERE email = $1 LIMIT 1`;
    const res = client
      ? await client.query<UserCoreRecord>(q, [email])
      : await pool.query<UserCoreRecord>(q, [email]);
    return res.rows[0] ?? null;
  },

  async create(
    params: { email: string; status?: string },
    client?: PoolClient,
  ): Promise<UserCoreRecord> {
    const q = `INSERT INTO users (email, status)
               VALUES ($1, $2)
               RETURNING id::text, email, status, phone_number, email_verified_at, phone_verified_at, last_login_at, deleted_at, created_at, updated_at`;
    const values = [params.email, params.status ?? "active"];
    const res = client
      ? await client.query<UserCoreRecord>(q, values)
      : await pool.query<UserCoreRecord>(q, values);
    return res.rows[0];
  },

  async createReturningId(
    params: { email: string; status?: string },
    client?: PoolClient,
  ): Promise<{ id: string; created_at: string }> {
    const q = `INSERT INTO users (email, status) VALUES ($1, $2) RETURNING id::text, created_at`;
    const values = [params.email, params.status ?? "active"];
    const res = client
      ? await client.query<{ id: string; created_at: string }>(q, values)
      : await pool.query<{ id: string; created_at: string }>(q, values);
    return res.rows[0];
  },
};
