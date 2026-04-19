// validations/innerSlider.ts

import { z } from "zod"

export const InnerSliderSchema = z.object({
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

  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .refine((val) => ["active", "inactive"].includes(val), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})

export type InnerSliderValues = z.infer<typeof InnerSliderSchema>