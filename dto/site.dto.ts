import { z } from "zod";

export const createSiteDtoSchema = z.object({
  name: z.string().min(1).max(16),
  description: z.string().max(64).optional(),
  icon: z.string().max(64).optional(),
  categoryIds: z.array(z.coerce.number()),
  urls: z.array(
    z.object({
      link: z.string(),
      label: z.string(),
    })
  ),
});

export type CreateSiteDto = z.infer<typeof createSiteDtoSchema>;
