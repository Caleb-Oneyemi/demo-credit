import { z } from 'zod'

export const userCreationSchema = z
  .object({
    name: z.string().trim().min(3),
    email: z.string().email(),
    password: z.string().trim().min(4),
  })
  .strict()
