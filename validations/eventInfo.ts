import { z } from "zod"
export const EventInfoSchema = z.object({
  _id: z.string().optional(),

  title: z
    .string()
    .min(1, "Title cannot be empty.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .min(1, "Description cannot be empty.")
    .max(500, "Description cannot exceed 500 characters."),
  image: z
    .union([
      z.string().url("Please provide a valid image URL."),
      z.string().regex(/^blob:.+/, {
        message: "Invalid image reference.",
      }),
      z.string().min(1, "Image is required."),
    ])
    .optional(),

  status: z
    .string()
    .min(1, 'Status is required.')
    .max(50, 'Status cannot exceed 50 characters.'),
  })
export type EventInfoValues = z.infer<typeof EventInfoSchema>