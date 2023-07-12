import { IUser } from './user.interface'

interface PostBase {
  author: IUser
  title: string
  content: string
  readTime?: number
  image?: string
}

export interface PostModel extends PostBase {
  categories: Array<string>
}

export interface CreatePost extends PostBase {
  categories: string
}

export type UpdatePost = Partial<CreatePost>
