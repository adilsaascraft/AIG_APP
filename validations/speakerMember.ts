// validations/speaker.ts

import { z } from "zod"

export const SpeakerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name cannot exceed 50 characters."),

  designation: z
    .string()
    .min(1, "Designation is required.")
    .max(100, "Designation cannot exceed 100 characters."),

  description: z
    .string()
    .max(500, "Description too long.")
    .optional(),

  image: z
    .string()
    .min(1, "Image is required."), // URL or path

  // 🔗 Relation to SpeakerType
  speakerTypeId: z
    .string()
    .min(1, "Speaker type is required."),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type SpeakerValues = z.infer<typeof SpeakerSchema>