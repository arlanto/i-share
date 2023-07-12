import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { userService } from '~/services/user.service'
import {
  accessTokenKey,
  cookieOptions,
  generateAccessToken,
  generateRefreshToken,
  generateTokenHash,
  refreshTokenKey,
  verifyJWT,
} from '~/utils/jwt'
import { CreateUser, Payload } from '~/interfaces/user.interface'
import { AppException } from '~/utils/app-exception'

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const data: CreateUser = req.body
    try {
      const username = await userService.findByUsername(data.username)
      if (username) {
        return next(new AppException(400, `Username ${data.username} is already taken`, 'username'))
      }
      const email = await userService.findByEmail(data.email)
      if (email) {
        return next(new AppException(400, `Email ${data.email} is already taken`, 'email'))
      }
      const salt = await bcrypt.genSalt(12)
      const hashedPassword = await bcrypt.hash(data.password, salt)
      const user = await userService.create({
        ...data,
        password: hashedPassword,
      })
      const refreshToken = await generateRefreshToken(user)
      const refreshTokenHash = generateTokenHash(refreshToken, refreshTokenKey)
      const accessToken = await generateAccessToken(user)
      user.tokens?.push({ token: refreshTokenHash })
      const updatedUser = await userService.update(user._id.toString(), user)
      res.cookie('refresh_token', refreshToken, cookieOptions)
      return res
        .status(201)
        .json({ message: 'Account created successfully', user: updatedUser, accessToken })
    } catch (error) {
      return next(error)
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    const data: Payload = req.body
    try {
      const user = await userService.findByEmail(data.email)
      if (!user) {
        return next(new AppException(400, 'Email or Password is invalid', 'password'))
      }
      const matchedPassword = await bcrypt.compare(data.password, user.password)
      if (!matchedPassword) {
        return next(new AppException(400, 'Email or Password is invalid', 'password'))
      }
      const refreshToken = await generateRefreshToken(user)
      const refreshTokenHash = generateTokenHash(refreshToken, refreshTokenKey)
      const accessToken = await generateAccessToken(user)
      user.tokens?.push({ token: refreshTokenHash })
      const updatedUser = await userService.update(user._id.toString(), user)
      res.cookie('refresh_token', refreshToken, cookieOptions)
      return res
        .status(200)
        .json({ message: 'User logged in successfully', user: updatedUser, accessToken })
    } catch (error) {
      return next(error)
    }
  }

  async signout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id as string
      const user = await userService.findById(userId)
      if (!user) {
        return next(new AppException(404, `User with id ${userId} not found`))
      }
      const refreshToken = req.signedCookies.refresh_token
      const refreshTokenHash = generateTokenHash(refreshToken, refreshTokenKey)
      user.tokens = user?.tokens?.filter(tokenObj => tokenObj.token !== refreshTokenHash)
      await userService.update(user._id.toString(), user)
      res.clearCookie('refresh_token')
      return res.status(205)
    } catch (error) {
      return next(error)
    }
  }

  async signoutAllDevices(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id as string
      const user = await userService.findById(userId)
      if (!user) {
        return next(new AppException(404, `User with id ${userId} not found`))
      }
      user.tokens = []
      await userService.update(user._id.toString(), user)
      res.clearCookie('refresh_token')
      return res.status(205)
    } catch (error) {
      return next(error)
    }
  }

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.signedCookies.refresh_token
      const authHeader = req.headers.authorization
      if (!refreshToken) {
        return next(new AppException(401, 'You are unauthorized'))
      }
      if (!authHeader?.startsWith('Bearer ')) {
        return next(new AppException(401, 'You are unauthorized'))
      }
      const accessToken = authHeader.split(' ')[1]
      verifyJWT(accessToken, accessTokenKey, true)
      const decodedRefreshToken = <{ _id: string; username: string; email: string }>(
        verifyJWT(refreshToken, refreshTokenKey)
      )
      const refreshTokenHash = generateTokenHash(refreshToken, refreshTokenKey)
      const userWithRefreshToken = await userService.findByToken(
        decodedRefreshToken._id.toString(),
        refreshTokenHash
      )
      if (!userWithRefreshToken) {
        return next(new AppException(401, 'You are unauthorized'))
      }
      userWithRefreshToken.tokens = userWithRefreshToken.tokens?.filter(
        tokenObj => tokenObj.token !== accessToken
      )
      await userService.update(userWithRefreshToken._id.toString(), userWithRefreshToken)
      const newAccessToken = await generateAccessToken(userWithRefreshToken)
      res.set({ 'Cache-Control': 'no-store', Pragma: 'no-cache' })
      return res
        .status(200)
        .json({ message: 'Access Token Refreshed successfully', accessToken: newAccessToken })
    } catch (error) {
      return next(error)
    }
  }
}

export const authController = new AuthController()
