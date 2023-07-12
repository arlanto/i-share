import { NextFunction, Request, Response } from 'express'
import { accessTokenKey, verifyJWT } from '~/utils/jwt'
import { AppException } from '~/utils/app-exception'

export const authorization = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppException(401, 'You are unauthenticated')
    }
    const accessToken = authHeader.split(' ')[1]
    const decodedToken = <{ _id: string; email: string; username: string }>(
      verifyJWT(accessToken, accessTokenKey)
    )
    req.user = decodedToken
    return next()
  } catch (error) {
    return next(error)
  }
}
