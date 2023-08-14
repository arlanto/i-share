import { Types } from 'mongoose'
import { IUser } from './user.interface'

interface PostBase {
  author: IUser
  title: string
  content: string
  readTime?: number
  cover?: string
  likesBy?: Array<IUser['_id']>
  likes: number
}

export interface IPost extends PostBase {
  _id: Types.ObjectId
}

export interface PostModel extends PostBase {
  topics: Array<string>
}

export interface CreatePost extends PostBase {
  topics: string
}

export type UpdatePost = Partial<CreatePost>
