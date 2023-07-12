import { NextFunction, Request, RequestHandler, Response } from 'express'
import { AnyZodObject, ZodEffects, ZodError, ZodOptional } from 'zod'

export const validate = (
  schema: AnyZodObject | ZodEffects<AnyZodObject> | ZodOptional<AnyZodObject>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      let err = error
      if (err instanceof ZodError) {
        err = err.issues.map(e => ({ path: e.path[0], message: e.message }))
      }
      res.status(400).send({ status: 400, error: err })
    }
  }
}
