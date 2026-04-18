// validations/download.ts

import { z } from "zod"

export const DownloadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  file: z
    .string()
    .min(1, "File is required."), // URL or file path

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type DownloadValues = z.infer<typeof DownloadSchema>