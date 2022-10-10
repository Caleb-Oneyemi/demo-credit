import { z } from 'zod'

export const transferCreationSchema = z
  .object({
    receiverId: z.number().min(1, 'Invalid receiver wallet Id'),
    amount: z
      .number()
      .min(1, 'Transfer sum must be greater than or equal to one Naira'),
  })
  .strict()
