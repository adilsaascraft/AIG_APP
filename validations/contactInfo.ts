// validations/contactInfo.ts

import { z } from "zod"

export const ContactInfoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .min(1, "Description is required."), // HTML content

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type ContactInfoValues = z.infer<typeof ContactInfoSchema>