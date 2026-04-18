import { z } from "zod"

export const CommitteeTypeSchema = z.object({
  _id: z.string().optional(),

  committeeType: z
    .string()
    .min(1, "Committee type cannot be empty.")
    .max(100, "Committee type cannot exceed 100 characters."),

  status: z
    .string()
    .min(1, "Status is required.")
    .max(20, "Status cannot exceed 20 characters.")
    .trim(),
})

export type CommitteeTypeValues = z.infer<typeof CommitteeTypeSchema>