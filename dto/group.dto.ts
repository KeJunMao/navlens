import { z } from "zod";

export const createGroupDtoSchema = z.object({
  name: z.string().min(1).max(16),
  code: z.string().min(1).max(16),
  icon: z.string().max(64).optional().nullable(),
});

export type CreateGroupDto = z.infer<typeof createGroupDtoSchema>;

export const searchGroupDtoSchema = z.object({
  name: z.string().max(16).optional(),
  code: z.string().max(16).optional(),
  take: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
});
