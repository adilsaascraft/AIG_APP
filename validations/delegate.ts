// validations/user.ts (or speakerProfile.ts)

import { z } from "zod"

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name cannot exceed 50 characters."),

  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email address."),

  designation: z
    .string()
    .min(1, "Designation is required.")
    .max(100, "Designation cannot exceed 100 characters."),

  image: z
    .string()
    .min(1, "Image is required."), // or use .url() if needed

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type UserValues = z.infer<typeof UserSchema>