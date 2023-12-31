import { z } from "zod";

export const createSiteDtoSchema = z.object({
  name: z.string().min(1).max(28),
  description: z.string().max(64).optional().nullable(),
  icon: z.string().max(64).optional().nullable(),
  categoryIds: z.array(z.coerce.number()).min(1),
  showQrcode: z.boolean().default(false),
  urls: z
    .object({
      id: z.coerce.number().optional().nullable(),
      link: z.string().url(),
      label: z.string().nullable(),
    })
    .array()
    .min(1),
});

export type CreateSiteDto = z.infer<typeof createSiteDtoSchema>;

export const searchSiteDtoSchema = z.object({
  name: z.string().max(16).optional(),
  description: z.string().max(20).optional(),
  categoryName: z.string().max(16).optional(),
  take: z.coerce.number().optional(),
  skip: z.coerce.number().optional(),
});
