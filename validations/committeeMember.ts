import { z } from "zod"

export const CommitteeMemberSchema = z.object({
  _id: z.string().optional(),

  name: z
    .string()
    .min(1, "Name cannot be empty.")
    .max(100, "Name cannot exceed 100 characters."),

  designation: z
    .string()
    .min(1, "Designation cannot be empty.")
    .max(100, "Designation cannot exceed 100 characters."),

  // 👇 this refers to committee type (e.g., Organizing, Scientific)
  type: z
    .string()
    .min(1, "Committee type is required.")
    .max(100, "Type cannot exceed 100 characters."),

  // ✅ same flexible image handling you used earlier
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
    .min(1, "Status is required.")
    .max(20, "Status cannot exceed 20 characters.")
    .trim(),
})

export type CommitteeMemberValues = z.infer<typeof CommitteeMemberSchema>