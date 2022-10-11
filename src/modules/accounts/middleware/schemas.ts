import { z } from 'zod'

export const accountUpsertSchema = z
  .object({
    amount: z.number().min(1, 'amount must equal or exceed 1 naira'),
  })
  .strict()
