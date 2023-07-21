import { z } from 'zod'

const createPostSchema = z.object({
  title: z
    .string({ required_error: 'Post Title is required' })
    .nonempty('Post Title cannot be empty')
    .trim(),
  content: z
    .string({ required_error: 'Post Content is required' })
    .nonempty('Post Content cannot be empty')
    .trim(),
  topics: z
    .string({ required_error: 'Post Topics is required' })
    .nonempty('Post Topics cannot be empty')
    .trim(),
})

const updatePostSchema = createPostSchema.optional()

export { createPostSchema, updatePostSchema }
