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
        return next(new AppException(404, 'User not found'))
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

  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await commentService.findAll()
      return res.status(200).json(comments)
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
      const auth = await userService.findById(user?._id as string)
      if (!auth) {
        return next(new AppException(404, 'Author not found'))
      }
      const comment = await commentService.findById(id)
      if (!comment.author._id.equals(auth._id)) {
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
      const auth = await userService.findById(user?._id as string)
      if (!auth) {
        return next(new AppException(404, 'Author not found'))
      }
      const comment = await commentService.findById(id)
      if (!comment.author._id.equals(auth._id)) {
        return next(new AppException(403, 'Access denied'))
      }
      await commentService.delete(comment._id.toString())
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
      const comment = await commentService.findById(id)
      if (comment.likesBy?.includes(user._id)) {
        const index = comment.likesBy.indexOf(user._id)
        comment.likesBy.splice(index, 1)
      } else {
        comment.likesBy?.push(user._id)
      }
      comment.likes = comment.likesBy?.length as number
      const commentLike = await comment.save()
      return res.status(200).json({ comment: commentLike })
    } catch (error) {
      return next(error)
    }
  }
}

export const commentController = new CommentController()
