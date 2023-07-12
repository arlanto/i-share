import { NextFunction, Request, Response } from 'express'
import { postService } from '~/services/post.service'
import { userService } from '~/services/user.service'
import { CreatePost, UpdatePost } from '~/interfaces/post.interface'
import { AppException } from '~/utils/app-exception'

class PostController {
  async create(req: Request, res: Response, next: NextFunction) {
    const data: CreatePost = req.body
    const user = req.user
    try {
      if (!user) {
        return next(new AppException(401, 'You are not logged in'))
      }
      const author = await userService.findById(user._id)
      if (!author) {
        return next(new AppException(400, 'Author does not exist'))
      }
      const post = await postService.create({
        ...data,
        author: author,
        image: req.file?.filename,
      })
      return res.status(201).json(post)
    } catch (error) {
      return next(error)
    }
  }

  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await postService.findAll()
      return res.status(200).json(posts)
    } catch (error) {
      return next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    try {
      const post = await postService.findById(id)
      return res.status(200).json(post)
    } catch (error) {
      return next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const data: UpdatePost = req.body
    const user = req.user
    try {
      if (!user) {
        return next(new AppException(401, 'You are not logged in'))
      }
      const author = await userService.findById(user._id)
      if (!author) {
        return next(new AppException(404, 'Author does not exist'))
      }
      const post = await postService.findById(id)
      if (!post.author._id.equals(author._id)) {
        return next(new AppException(403, 'Access denied'))
      }
      const updatedPost = await postService.update(id, {
        ...data,
        image: req.file?.filename,
      })
      return res.status(200).json({ post: updatedPost })
    } catch (error) {
      return next(error)
    }
  }
}

export const postController = new PostController()
