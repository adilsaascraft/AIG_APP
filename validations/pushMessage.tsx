// validations/pushMessage.ts

import { z } from "zod"

export const PushMessageSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  message: z
    .string()
    .min(1, "Message is required.")
    .max(500, "Message cannot exceed 500 characters."),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type PushMessageValues = z.infer<typeof PushMessageSchema>