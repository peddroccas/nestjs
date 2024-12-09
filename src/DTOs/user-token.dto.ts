import { z } from 'zod'

export const tokenSchema = z.object({
  sub: z.string().uuid(),
})

export type UserTokenDTO = z.infer<typeof tokenSchema>
