import { ZodFormattedError } from 'zod'
import { envSchema } from '~/schemas/env.schema'
import { env } from './env'

const envVars = envSchema.safeParse(env)

const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>
): (string | undefined)[] =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) return `${name} ${value._errors.join(',')}\n`
    })
    .filter(Boolean)

if (!envVars.success) {
  console.error('Invalid environment variables:\n', ...formatErrors(envVars.error.format()))
  process.exit(1)
}
