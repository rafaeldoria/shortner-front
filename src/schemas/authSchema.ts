import { z } from "zod";

export const REUSED_PASSWORD_MESSAGE =
  "New password must be different from current password";

export const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .refine((val) => val.trim() === val, {
    error: "Password must not start or end with spaces",
  })
  .refine((val) => /[a-zA-Z]/.test(val), {
    error: "Password must be at least 1 letter",
  })
  .refine((val) => /\d/.test(val), {
    error: "Password must be at least 1 number",
  })
  .refine((val) => /[^a-zA-Z0-9]/.test(val), {
    error: "Password must be at least 1 special character",
  });

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters" })
    .max(64, { error: "Username must be at most 64 characters" })
    .regex(/^[a-zA-Z0-9._-]+$/, {
      error: "Username can only contain letters, numbers, dots, underscores and hyphens",
    }),
  email: z.string().email({ error: "Invalid email" }),
  password: passwordSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, { error: "Email or username is required" }),
  password: z.string().min(1, { error: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { error: "Current password is required" }),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, { error: "Password confirmation is required" }),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    error: REUSED_PASSWORD_MESSAGE,
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
