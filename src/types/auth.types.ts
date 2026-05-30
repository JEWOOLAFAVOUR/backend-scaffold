import { UserPublicDTO } from "./user.types";

export type LoginResponse = {
  access_token: string;
  token_type: "Bearer";
  user: UserPublicDTO;
};
