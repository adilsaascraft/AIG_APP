// validations/quickLink.ts

import { z } from "zod"

export const QuickLinkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  link: z
    .string()
    .min(1, "Link is required.")
    .url("Invalid URL format."),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type QuickLinkValues = z.infer<typeof QuickLinkSchema>