export type UserCoreRecord = {
  id: string;
  email: string;
  email_normalized: string;
  email_verified_at?: string | null;
  phone_number?: string | null;
  phone_verified_at?: string | null;
  status: "active" | "suspended" | "disabled" | "pending_verification";
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  last_login_at?: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSecurityRecord = {
  id: string;
  user_id: string;
  password_hash: string;
  password_changed_at?: string | null;
  failed_login_count: number;
  locked_until?: string | null;
  created_at: string;
  updated_at: string;
};
