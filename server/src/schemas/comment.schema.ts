import { z } from 'zod'

const commentSchema = z.object({
  content: z
    .string({ required_error: 'Comment Content is required' })
    .nonempty('Comment Content cannot be empty')
    .trim(),
})

export { commentSchema }
