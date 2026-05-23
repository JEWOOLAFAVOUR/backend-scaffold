import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().trim().email().max(80),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
