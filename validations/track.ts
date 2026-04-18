// validations/track.ts

import { z } from "zod"
import { BaseMetaSchema } from "./sessionDate"

export const TrackSchema = BaseMetaSchema.extend({
  sessionDateId: z
    .string()
    .min(1, "Session Date is required."),
})

export type TrackValues = z.infer<typeof TrackSchema>