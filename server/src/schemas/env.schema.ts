import { z } from 'zod'

export const envSchema = z.object({
  APP_PORT: z
    .number({ required_error: 'is required', invalid_type_error: 'must be a number' })
    .min(0, ' cannot be null')
    .nonnegative(' must be a positive number'),
  DB_URI: z.string({ required_error: 'is required' }).url(' must be an url'),
  COOKIE_SECRET: z.string({ required_error: 'is required' }).nonempty(' cannot be empty'),
  ACCESS_TOKEN_SECRET: z.string({ required_error: 'is required' }).nonempty(' cannot be empty'),
  ACCESS_TOKEN_EXPIRY: z.string({ required_error: 'is required' }).nonempty(' cannot be empty'),
  REFRESH_TOKEN_SECRET: z.string({ required_error: 'is required' }).nonempty(' cannot be empty'),
  REFRESH_TOKEN_EXPIRY: z.string({ required_error: 'is required' }).nonempty(' cannot be empty'),
  ALLOWED_DOMAIN: z.string({ required_error: 'is required' }).nonempty(' cannot be empty').url('must be a valid url'),
})
