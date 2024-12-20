import { z } from 'zod'

export const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type AuthenticateDTO = z.infer<typeof authenticateSchema>
