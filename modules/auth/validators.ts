import { z } from "zod";

export const loginUserSchema = z
  .object({
    email: z.string().trim().email().max(254),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
  })
  .strict();

export type LoginUserInput = z.infer<typeof loginUserSchema>;

export const registerUserSchema = z
  .object({
    email: z.string().trim().email().max(254),
    first_name: z.string().trim().min(2).max(80),
    last_name: z.string().trim().min(2).max(80),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
  })
  .strict();

export type RegisterUserInput = z.infer<typeof registerUserSchema>;