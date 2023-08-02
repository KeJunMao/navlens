import { z } from "zod";

export const updateUserDtoSchema = z
  .object({
    username: z.string().min(1).max(16),
    password: z.string().min(6).max(16),
    repassword: z.string().min(6).max(16),
  })
  .refine((data) => data.password === data.repassword, {
    message: "两次密码输入不一致",
  });

export const LoginDtoSchema = z.object({
  username: z.string().min(1).max(16),
  password: z.string().min(6).max(16),
})
