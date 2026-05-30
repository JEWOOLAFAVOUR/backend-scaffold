import { z } from "zod";

export const loginUserSchema = z
  .object({
    email: z.string().trim().toLowerCase().email().max(254),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
  })
  .strict();

export type LoginUserInput = z.infer<typeof loginUserSchema>;
