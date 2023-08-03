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
      const author = await userService.findById(user?._id as string)
      if (!author) {
        return next(new AppException(404, 'User not found'))
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
      const author = await userService.findById(user?._id as string)
      if (!author) {
        return next(new AppException(404, 'Author not found'))
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

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const user = req.user
    try {
      const author = await userService.findById(user?._id as string)
      if (!author) {
        return next(new AppException(404, 'Author not found'))
      }
      const post = await postService.findById(id)
      if (!post.author._id.equals(author._id)) {
        return next(new AppException(403, 'Access denied'))
      }
      await postService.delete(id)
      return res.status(204).json({ success: true })
    } catch (error) {
      return next(error)
    }
  }

  async like(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const auth = req.user
    try {
      const user = await userService.findById(auth?._id as string)
      if (!user) {
        return next(new AppException(404, 'User not found'))
      }
      const post = await postService.findById(id)
      if (post.likesBy?.includes(user._id)) {
        const index = post.likesBy.indexOf(user._id)
        post.likesBy.splice(index, 1)
      } else {
        post.likesBy?.push(user._id)
      }
      post.likes = post.likesBy?.length as number
      const likePost = await post.save()
      return res.status(200).json({ post: likePost })
    } catch (error) {
      return next(error)
    }
  }
}

export const postController = new PostController()
