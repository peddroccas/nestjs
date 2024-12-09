import { z } from 'zod'

export const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export type CreateQuestionDTO = z.infer<typeof createQuestionSchema>
