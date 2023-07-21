import { z } from "zod";

export const createCategoryDtoSchema = z.object({
  groupId: z.number(),
  name: z.string().min(1).max(16),
  icon: z.string().max(64).optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDtoSchema>;
