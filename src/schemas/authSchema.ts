import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters" })
    .max(20, { error: "Username must be only 20 characters" }),
  email: z.string().email({ error: "Invalid email" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" })
    .refine((val) => /[a-zA-Z]/.test(val), {
      error: "Password must be at least 1 letter",
    })
    .refine((val) => /\d/.test(val), {
      error: "Password must be at least 1 number",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      error: "Password must be at least 1 special character",
    }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, { error: "Email or username is required" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;