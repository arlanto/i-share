import { Comment } from '~/models/comment.model'
import { CommentModel } from '~/interfaces/comment.interface'
import { AppException } from '~/utils/app-exception'

class CommentService {
  async create(data: CommentModel) {
    const newComment = await Comment.create(data)
    const comment = await newComment.save()
    return comment
  }

  async findAll() {
    const comments = await Comment.find()
    return comments
  }

  async findById(id: string) {
    const comment = await Comment.findById({ _id: id })
    if (!comment) {
      throw new AppException(404, `Comment with id ${id} not found`)
    }
    return comment
  }

  async update(id: string, data: CommentModel) {
    const updatedComment = await Comment.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: data,
      },
      {
        new: true,
      }
    )
    return updatedComment
  }

  async delete(id: string) {
    const comment = await Comment.findByIdAndDelete({ _id: id })
    return comment
  }
}

export const commentService = new CommentService()
