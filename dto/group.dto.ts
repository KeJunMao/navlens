import { z } from "zod";

export const createGroupDtoSchema = z.object({
  name: z.string().min(1).max(16),
  code: z.string().min(1).max(16),
  icon: z.string().max(64).optional(),
});

export type CreateGroupDto = z.infer<typeof createGroupDtoSchema>;
