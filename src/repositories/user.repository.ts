import { pool } from "../database/connection";

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

export const userRepository = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const res = await pool.query(
      `SELECT id, email, name, password_hash, created_at, updated_ at
        FROM users WHERE email = $1 LIMIT 1`,
      [email],
    );
    return res.rows[0] ?? null;
  },

  async create(params: { email: string; name: string; password_hash: string }) {
    const res = await pool.query(
      `INSERT INTO users (email, name, password_hash)
        VALUES ($1, $2, $3)
        RETURNinG id, email, name, created_at, updated_at`,
      [params.email, params.name, params.password_hash],
    );
    return res.rows[0];
  },
};
