export type UserCoreRecord = {
  id: string;
  email: string;
  status: "active" | "suspended" | "disabled" | "pending_verification";
  email_verified_at?: string | null;
  phone_number?: string | null;
  phone_verified_at?: string | null;
  deleted_at?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSecurityRecord = {
  user_id: string;
  password_hash: string;
  password_changed_at?: string | null;
  two_factor_enabled: boolean;
  failed_login_count?: number;
  locked_until?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfileRecord = {
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
  date_of_birth?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserPublicDTO = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url: string | null;
  status: UserCoreRecord["status"];
  created_at: string;
};
