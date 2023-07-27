import { z } from "zod";

export const createSiteDtoSchema = z.object({
  name: z.string().min(1).max(16),
  description: z.string().max(64).optional().nullable(),
  icon: z.string().max(64).optional().nullable(),
  categoryIds: z.array(z.coerce.number()).min(1),
  showQrcode: z.boolean().default(false),
  urls: z
    .array(
      z.object({
        id: z.coerce.number().optional(),
        link: z.string().url(),
        label: z.string().nullable(),
      })
    )
    .min(1),
});

export type CreateSiteDto = z.infer<typeof createSiteDtoSchema>;

export const searchSiteDtoSchema = z.object({
  name: z.string().max(16).optional(),
  description: z.string().max(20).optional(),
  categoryName: z.string().max(16).optional(),
});
