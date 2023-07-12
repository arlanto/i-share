import { z } from 'zod'

const signupSchema = z
  .object({
    username: z
      .string({ required_error: 'Username is required' })
      .nonempty('Username cannot be empty')
      .trim(),
    email: z
      .string({ required_error: 'Email Address is required' })
      .email('Invalid Email Address')
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must contain at least 6 characters')
      .trim(),
    confirm: z
      .string({ required_error: 'Confirm Password is required' })
      .nonempty('Confirm Password cannot be empty')
      .trim(),
  })
  .refine(data => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

const signinSchema = z.object({
  email: z
    .string({ required_error: 'Email Address is required' })
    .email('Invalid Email Address')
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .nonempty('Password cannot be empty')
    .trim(),
})

export { signinSchema, signupSchema }
