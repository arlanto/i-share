import crypto from 'crypto'
import { CookieOptions } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { IUser } from '~/interfaces/user.interface'
import { env } from './env'

const accessTokenKey = env.ACCESS_TOKEN_SECRET
const accessTokenExpiry: number = eval(env.ACCESS_TOKEN_EXPIRY)

const refreshTokenKey = env.REFRESH_TOKEN_SECRET
const refreshTokenExpiry: number = eval(env.REFRESH_TOKEN_EXPIRY)

const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: refreshTokenExpiry * 1000,
  sameSite: 'none',
  secure: false,
  signed: true,
}

const generateAccessToken = async (user: IUser): Promise<string> => {
  return jwt.sign(
    {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
    accessTokenKey,
    {
      expiresIn: accessTokenExpiry,
    }
  )
}

const generateRefreshToken = async (user: IUser): Promise<string> => {
  return jwt.sign(
    {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
    },
    refreshTokenKey,
    {
      expiresIn: refreshTokenExpiry,
    }
  )
}

const generateTokenHash = (token: string, key: string): string => {
  return crypto.createHmac('sha256', key).update(token).digest('hex')
}

const verifyJWT = (token: string, hash: string, ignoreExp?: boolean): string | JwtPayload => {
  return jwt.verify(token, hash, { ignoreExpiration: ignoreExp })
}

export {
  accessTokenKey,
  cookieOptions,
  generateAccessToken,
  generateRefreshToken,
  generateTokenHash,
  refreshTokenKey,
  verifyJWT,
}
