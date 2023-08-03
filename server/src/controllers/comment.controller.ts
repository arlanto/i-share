import { NextFunction, Request, Response } from 'express'
import { commentService } from '~/services/comment.service'
import { userService } from '~/services/user.service'
import { postService } from '~/services/post.service'
import { CommentModel } from '~/interfaces/comment.interface'
import { AppException } from '~/utils/app-exception'

class CommentController {
  async create(req: Request, res: Response, next: NextFunction) {
    const data: CommentModel = req.body
    const user = req.user
    const id = req.params.id
    try {
      const author = await userService.findById(user?._id as string)
      if (!author) {
        return next(new AppException(401, 'User not found'))
      }
      const post = await postService.findById(id)
      if (!post) {
        return next(new AppException(404, 'Post not found'))
      }
      const comment = await commentService.create({
        ...data,
        author,
        post,
      })
      return res.status(201).json({ comment })
    } catch (error) {
      return next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await commentService.findById(req.params.id)
      return res.status(200).json({ comment })
    } catch (error) {
      return next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const data: CommentModel = req.body
    const user = req.user
    const id = req.params.id
    try {
      const userAuth = await userService.findById(user?._id as string)
      if (!userAuth) {
        return next(new AppException(404, 'Author not found'))
      }
      const comment = await commentService.findById(id)
      if (!comment.author._id.equals(userAuth._id)) {
        return next(new AppException(403, 'Access denied'))
      }
      const updatedComment = await commentService.update(id, data)
      return res
        .status(200)
        .json({ message: 'Comment updated successfully', comment: updatedComment })
    } catch (error) {
      return next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const user = req.user
    const id = req.params.id
    try {
      const authUser = await userService.findById(user?._id as string)
      if (!authUser) {
        return next(new AppException(404, 'Author not found'))
      }
      const comment = await commentService.findById(id)
      if (!comment.author._id.equals(authUser._id)) {
        return next(new AppException(403, 'Access denied'))
      }
      await commentService.delete(comment._id.toString())
      return res.status(204).json({ success: true })
    } catch (error) {
      return next(error)
    }
  }
}

export const commentController = new CommentController()
