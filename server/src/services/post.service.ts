import { Post } from '~/models/post.model'
import { CreatePost, UpdatePost } from '~/interfaces/post.interface'
import { AppException } from '~/utils/app-exception'

class PostService {
  async create(data: CreatePost) {
    const newPost = await Post.create({
      ...data,
      categories: data.categories.split('+'),
    })
    const post = newPost.save()
    return post
  }

  async findAll() {
    const posts = await Post.find().populate('author')
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
          categories: data.categories?.split('+'),
        },
      },
      {
        new: true,
      }
    )
    return post
  }
}

export const postService = new PostService()
