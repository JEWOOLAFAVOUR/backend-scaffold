import { PoolClient } from "pg";
import { pool } from "../database/connection";
import { UserProfileRecord } from "../types/user.types";

export const userProfileRepository = {
  async create(
    profile: {
      user_id: string;
      first_name?: string | null;
      last_name?: string | null;
      date_of_birth?: string | null;
      avatar_url?: string | null;
      cover_url?: string | null;
    },
    client?: PoolClient,
  ): Promise<UserProfileRecord> {
    const q = `INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, avatar_url, cover_url)
               VALUES ($1,$2,$3,$4,$5,$6)
               ON CONFLICT (user_id) DO UPDATE
                 SET first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
                     last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
                     avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
                     cover_url = COALESCE(EXCLUDED.cover_url, user_profiles.cover_url),
                     updated_at = now()
               RETURNING user_id::text AS user_id, first_name, last_name, date_of_birth::text AS date_of_birth, avatar_url, cover_url, created_at, updated_at`;
    const values = [
      profile.user_id,
      profile.first_name ?? null,
      profile.last_name ?? null,
      profile.date_of_birth ?? null,
      profile.avatar_url ?? null,
      profile.cover_url ?? null,
    ];
    const res = client
      ? await client.query<UserProfileRecord>(q, values)
      : await pool.query<UserProfileRecord>(q, values);
    return res.rows[0];
  },

  async findByUserId(
    user_id: string,
    client?: PoolClient,
  ): Promise<UserProfileRecord | null> {
    const q = `SELECT user_id::text AS user_id,
                first_name,
                last_name,
                date_of_birth::text AS date_of_birth,
                avatar_url,
                cover_url,
                created_at, 
                updated_at
            FROM user_profiles
            WHERE user_id = $1
            LIMIT 1`;

    const res = client
      ? await client.query<UserProfileRecord>(q, [user_id])
      : await pool.query<UserProfileRecord>(q, [user_id]);

    return res.rows[0] ?? null;
  },
};
