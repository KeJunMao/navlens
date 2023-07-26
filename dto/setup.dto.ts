import { z } from "zod";

export const setupUserDtoSchema = z.object({
  username: z.string().min(1).max(16),
  password: z.string().min(6).max(16),
  repassword: z.string().min(6).max(16),
});

export const setupUrlDtoSchema = z.object({
  name: z.string().min(1).max(16),
  url: z.string().url(),
});
// TODO: better way merge these
export const setupAppDtoSchema = z.object({
  username: z.string().min(1).max(16),
  password: z.string().min(6).max(16),
  repassword: z.string().min(6).max(16),

  name: z.string().min(1).max(16),
  url: z.string().url(),
});
