// validations/quiz.ts

import { z } from "zod"

export const QuizSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required.")
    .max(300, "Question cannot exceed 300 characters."),

  options: z
    .array(
      z.string().min(1, "Option cannot be empty.")
    )
    .min(2, "At least 2 options are required.")
    .max(6, "Maximum 6 options allowed."),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type QuizValues = z.infer<typeof QuizSchema>