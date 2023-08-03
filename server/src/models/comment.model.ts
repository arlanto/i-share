import { model, Schema, Types } from 'mongoose'
import { CommentModel } from '~/interfaces/comment.interface'

const CommentSchema = new Schema<CommentModel>(
  {
    post: {
      type: Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Comment = model<CommentModel>('Comment', CommentSchema)
