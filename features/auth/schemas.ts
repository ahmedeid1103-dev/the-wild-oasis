import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .max(254)
  .email()
  .transform((email) => email.toLowerCase());

const passwordSchema = z.string().max(128);

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema.min(1),
});

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema.min(8),
});
