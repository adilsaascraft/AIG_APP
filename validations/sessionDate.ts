import { z } from "zod"

export const BaseMetaSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name cannot exceed 50 characters."),

  color: z
    .string()
    .min(1, "Color is required.")
    .max(20, "Color cannot exceed 20 characters."),

  status: z
    .string()
    .min(1, "Status is required.")
    .refine((val) => ["active", "inactive"].includes(val.toLowerCase()), {
      message: "Status must be either 'active' or 'inactive'.",
    }),
})