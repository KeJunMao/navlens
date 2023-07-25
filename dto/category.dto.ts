import { z } from "zod";

export const createCategoryDtoSchema = z.object({
  groupId: z.number(),
  name: z.string().min(1).max(16),
  icon: z.string().max(64).optional().nullable(),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDtoSchema>;

export const searchCategoryDtoSchema = z.object({
  name: z.string().max(16).optional(),
  groupName: z.string().max(16).optional(),
});
