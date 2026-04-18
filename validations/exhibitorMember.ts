// validations/exhibitorMember.ts

import { z } from "zod"

export const ExhibitorMemberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(100, "Name cannot exceed 100 characters."),

  stall: z
    .string()
    .min(1, "Stall is required.")
    .max(50, "Stall cannot exceed 50 characters."),

  hall: z
    .string()
    .min(1, "Hall is required.")
    .max(50, "Hall cannot exceed 50 characters."),

  exhibitorTypeId: z
    .string()
    .min(1, "Exhibitor type is required."),

  image: z
    .string()
    .min(1, "Image is required."), // can upgrade to .url()

  description: z
    .string()
    .min(1, "Description is required.")
    .max(500, "Description cannot exceed 500 characters."),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type ExhibitorMemberValues = z.infer<typeof ExhibitorMemberSchema>