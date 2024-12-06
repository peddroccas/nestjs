import { z } from 'zod'

export const createAccountSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type CreateAccountDTO = z.infer<typeof createAccountSchema>
