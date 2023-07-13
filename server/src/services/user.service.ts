import { User } from '~/models/user.model'
import bcrypt from 'bcrypt'
import { CreateUser, UpdateUser } from '~/interfaces/user.interface'

class UserService {
  async create(data: CreateUser) {
    const newUser = await User.create(data)
    const user = await newUser.save()
    return user
  }

  async findByEmail(email: string) {
    const user = await User.findOne({ email })
    return user
  }

  async findById(id: string) {
    const user = await User.findById({ _id: id })
    return user
  }

  async findByToken(id: string, token: string) {
    const user = await User.findOne({
      _id: id,
      'tokens.token': token,
    })
    return user
  }

  async findByUsername(username: string) {
    const user = await User.findOne({ username })
    return user
  }

  async update(id: string, data: UpdateUser) {
    const user = await User.findByIdAndUpdate(
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
    return user
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  }

  async verifyPassword(password: string, hash: string) {
    const matchedPassword = await bcrypt.compare(password, hash)
    return matchedPassword
  }
}

export const userService = new UserService()
