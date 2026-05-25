import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  name: z.string().trim().min(2).max(80),
  password: z
    .string()
    .min(8, "Password must be at least 12 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
