// validations/schedule.ts

import { z } from "zod"

export const ScheduleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title cannot exceed 100 characters."),

  hall: z
    .string()
    .min(1, "Hall is required.")
    .max(50, "Hall cannot exceed 50 characters."),

  date: z
    .string()
    .min(1, "Date is required."), // ISO date recommended

  startTime: z
    .string()
    .min(1, "Start time is required."),

  endTime: z
    .string()
    .min(1, "End time is required."),

  description: z
    .string()
    .max(300, "Description too long.")
    .optional(),

  // 🔗 Relations
  sessionDateId: z
    .string()
    .min(1, "Session Date is required."),

  trackId: z
    .string()
    .min(1, "Track is required."),

  status: z.enum(["active", "inactive"]),


})

export type ScheduleValues = z.infer<typeof ScheduleSchema>