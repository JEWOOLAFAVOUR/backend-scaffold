import { z } from "zod";

export const auditQuerySchema = z
  .object({
    actor_id: z.string().optional(),
    action: z.string().optional(),
    limit: z.coerce.number().int().positive().max(100).default(20),
  })
  .strict();
