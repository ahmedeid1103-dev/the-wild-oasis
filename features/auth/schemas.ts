import { z } from "zod";

// Auth forms share a single validation layer before they reach Better Auth.
// We normalize email casing here so the same account can be used consistently across login/signup.

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
