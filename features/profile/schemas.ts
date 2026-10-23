import { z } from "zod";

export const guestProfileSchema = z.object({
  fullName: z.string().trim().min(1).max(150),
  nationality: z.string().trim().min(1).max(100),
  nationalID: z.string().trim().min(1).max(100),
  countryFlag: z.string().trim().min(1).max(16),
});

export type GuestProfile = z.infer<typeof guestProfileSchema>;
