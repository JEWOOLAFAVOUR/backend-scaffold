import type { UserCoreRecord } from "./auth.records";

export type LoginResponse = {
  access_token: string;
  token_type: "Bearer";
  user: {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
    avatar_url?: string | null;
    status: UserCoreRecord["status"];
    created_at: string;
  };
};

export type RegisterResponse = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  status: UserCoreRecord["status"];
  created_at: string;
};
