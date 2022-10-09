import { z } from 'zod'

export const accountCreationSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
  .strict()
