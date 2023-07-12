import { model, Schema, Types } from 'mongoose'
import { PostModel } from '~/interfaces/post.interface'

const PostSchema = new Schema<PostModel>(
  {
    author: {
      type: Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: String,
        required: true,
      },
    ],
    readTime: {
      type: Number,
      required: false,
      default: 3,
    },
    image: {
      type: String,
      required: false,
      default: 'default.jpg',
    },
  },
  {
    timestamps: true,
  }
)

export const Post = model<PostModel>('Post', PostSchema)
