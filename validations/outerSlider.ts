// validations/outerSlider.ts

import { z } from "zod"

export const OuterSliderSchema = z.object({
  _id: z.string().optional(),

  image: z
    .union([
      z.string().url("Please provide a valid image URL."),
      z.string().regex(/^blob:.+/, {
        message: "Invalid image reference.",
      }),
      z.string().min(1, "Image is required."),
    ])
    .refine((val) => val && val.length > 0, {
      message: "Image is required.",
    }),

  eventName: z
    .string()
    .min(1, "Event name is required.")
    .max(100, "Event name cannot exceed 100 characters."),

  location: z
    .string()
    .min(1, "Location is required.")
    .max(100, "Location cannot exceed 100 characters."),

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type OuterSliderValues = z.infer<typeof OuterSliderSchema>