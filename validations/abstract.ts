import { z } from "zod"

export const AbstractSchema = z.object({
  _id: z.string().optional(),

  authorName: z
    .string()
    .min(1, "Author name is required.")
    .max(100, "Author name cannot exceed 100 characters."),

  abstractTitle: z
    .string()
    .min(1, "Abstract title is required.")
    .max(150, "Abstract title cannot exceed 150 characters."),

  track: z
    .string()
    .min(1, "Track is required.")
    .max(100, "Track cannot exceed 100 characters."),

  abstractNumber: z
    .string()
    .min(1, "Abstract number is required.")
    .max(50, "Abstract number cannot exceed 50 characters."),

  abstractDetails: z
    .string()
    .min(1, "Abstract details are required.")
    .max(2000, "Abstract details cannot exceed 2000 characters."),

  status: z
    .string()
    .min(1, "Status is required.")
    .max(50, "Status cannot exceed 50 characters."),
})

export type AbstractValues = z.infer<typeof AbstractSchema>