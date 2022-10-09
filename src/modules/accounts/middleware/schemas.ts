import { z } from 'zod'

export const accountUpsertSchema = z
  .object({
    amount: z.number(),
  })
  .strict()
