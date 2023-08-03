import { Request, Response, NextFunction } from 'express'
import { userService } from '~/services/user.service'
import { IUser, UpdateUser } from '~/interfaces/user.interface'
import { AppException } from '~/utils/app-exception'

class UserController {
  async findById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    try {
      const user = await userService.findById(id)
      return res.status(200).json(user)
    } catch (error) {
      return next(error)
    }
  }

  async findMyPosts(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    try {
      const author = await userService.findById(user?._id as string)
      const posts = await userService.findMyPosts(author as IUser)
      return res.status(200).json(posts)
    } catch (error) {
      return next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const auth = req.user
    const data: UpdateUser = req.body
    try {
      const user = await userService.findById(auth?._id as string)
      if (!user) {
        return next(new AppException(404, 'User not found'))
      }
      if (!user._id.equals(id)) {
        return next(new AppException(403, 'Access denied'))
      }
      const updatedUser = await userService.update(id, data)
      return res
        .status(200)
        .json({ message: 'User Profile updated successfully', user: updatedUser })
    } catch (error) {
      return next(error)
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const data = req.body
    const auth = req.user
    try {
      const user = await userService.findById(auth?._id as string)
      if (!user) {
        return next(new AppException(404, 'User not found'))
      }
      if (!user._id.equals(id)) {
        return next(new AppException(403, 'Access denied'))
      }
      const hashedPassword = await userService.hashPassword(data.password)
      const updatedUser = await userService.update(id, {
        ...data,
        password: hashedPassword,
      })
      return res.status(200).json({ message: 'Password updated successfully', user: updatedUser })
    } catch (error) {
      return next(error)
    }
  }

  async changeAvatar(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const data = req.body
    const auth = req.user
    try {
      const user = await userService.findById(auth?._id as string)
      if (!user) {
        return next(new AppException(404, 'User not found'))
      }
      if (!user._id.equals(id)) {
        return next(new AppException(403, 'Access denied'))
      }
      const avatar = await userService.update(id, {
        ...data,
        avatar: req.file?.filename,
      })
      return res.status(200).json({ message: 'Image Profile updated successfully', avatar })
    } catch (error) {
      return next(error)
    }
  }
}

export const userController = new UserController()
