export class AppException extends Error {
  status: number
  message: string
  path?: string

  constructor(status: number, message: string, path?: string) {
    super(message)
    this.status = status
    this.message = message
    this.path = path
  }
}
