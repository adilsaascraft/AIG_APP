// validations/exhibitorType.ts

import { z } from "zod"

export const ExhibitorTypeSchema = z.object({
  exhibitorType: z
    .string()
    .min(1, "Exhibitor type is required.")
    .max(50, "Exhibitor type cannot exceed 50 characters."),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type ExhibitorTypeValues = z.infer<typeof ExhibitorTypeSchema>