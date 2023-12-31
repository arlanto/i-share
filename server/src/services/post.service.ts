import { Post } from '~/models/post.model'
import { CreatePost, UpdatePost } from '~/interfaces/post.interface'
import { AppException } from '~/utils/app-exception'
import { IUser } from '~/interfaces/user.interface'

class PostService {
  async create(data: CreatePost) {
    const newPost = await Post.create({
      ...data,
      topics: data.topics.split('+'),
    })
    const post = newPost.save()
    return post
  }

  async findAll() {
    const posts = await Post.find().populate('author')
    return posts
  }

  async findByAuthor(user: IUser) {
    const posts = await Post.find({ author: user })
    return posts
  }

  async findById(id: string) {
    const post = await Post.findById({ _id: id }).populate('author')
    if (!post) {
      throw new AppException(404, `Post with id ${id} not found`)
    }
    return post
  }

  async update(id: string, data: UpdatePost) {
    const post = await Post.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...data,
          topics: data.topics?.split('+'),
        },
      },
      {
        new: true,
      }
    )
    return post
  }

  async delete(id: string) {
    const post = await Post.findByIdAndDelete({ _id: id })
    return post
  }
}

export const postService = new PostService()
