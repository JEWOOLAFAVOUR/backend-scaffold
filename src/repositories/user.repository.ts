import { pool } from "../database/connection";

export type UserRecord = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  avatar_url: string;
  cover_url: string;
  date_of_birth: Date;
  email_verified: boolean;
  phone_verified: boolean;
  email_verified_at: Date;
  password_hash: string;
  two_factor_enabled: boolean;
  last_login_at: Date;
  created_at: string;
  updated_at: string;
};

export const userRepository = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const res = await pool.query(
      `SELECT id, email, name, password_hash, created_at, updated_at
        FROM users 
        WHERE email = $1 
        LIMIT 1`,
      [email],
    );
    return res.rows[0] ?? null;
  },

  async create(params: {
    email: string;
    name: string;
    password_hash: string;
  }): Promise<UserRecord> {
    const res = await pool.query(
      `INSERT INTO users (email, name, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, email, name, created_at, updated_at`,
      [params.email, params.name, params.password_hash],
    );
    return res.rows[0];
  },
};
