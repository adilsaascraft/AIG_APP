// validations/speakerType.ts

import { z } from "zod"

export const SpeakerTypeSchema = z.object({
  speakerType: z
    .string()
    .min(1, "Speaker type is required.")
    .max(50, "Speaker type cannot exceed 50 characters."),

  status: z.enum(["active", "inactive"]),
})

export type SpeakerTypeValues = z.infer<typeof SpeakerTypeSchema>