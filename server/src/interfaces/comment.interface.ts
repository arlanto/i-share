import { IPost } from './post.interface'
import { IUser } from './user.interface'

export interface CommentModel {
  post: IPost
  content: string
  author: IUser
}
