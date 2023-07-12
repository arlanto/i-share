import mongoose, { Error } from 'mongoose'

export const startDB = (uri: string): void => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log('DATABASE CONNECTION ESTABLISHED')
    })
    .catch((error: Error) => {
      console.error('DATABASE CONNECTION FAILED')
      console.error(error.message)
      process.exit(1)
    })
}
