import { z } from "zod";

export const setupAppDtoSchema = z.object({
  name: z.string().min(1).max(16),
  url: z.string().url(),
});
