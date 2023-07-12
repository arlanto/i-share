import { NextFunction, Request, Response } from 'express'
import { AppException } from '~/utils/app-exception'

export const errorMiddleware = (
  error: AppException,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  const path = error.path

  res.status(status).send({ status, error: [{ message, path }] })

  next()
}
