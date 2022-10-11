import { z } from 'zod'

export const transferCreationSchema = z
  .object({
    receiverId: z.number().min(1, 'Invalid receiver wallet Id'),
    amount: z.number().min(1, 'amount must equal or exceed 1 naira'),
  })
  .strict()
