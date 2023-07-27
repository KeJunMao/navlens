import { z } from "zod";

const _setupUserDtoSchema = z.object({
  username: z.string().min(1).max(16),
  password: z.string().min(6).max(16),
  repassword: z.string().min(6).max(16),
});

export const setupUserDtoSchema = _setupUserDtoSchema.refine(
  (data) => data.password === data.repassword,
  {
    message: "两次密码输入不一致",
  }
);

export const setupUrlDtoSchema = z.object({
  name: z.string().min(1).max(16),
  url: z.string().url(),
});
// TODO: better way merge these
export const setupAppDtoSchema = setupUrlDtoSchema.merge(_setupUserDtoSchema);
