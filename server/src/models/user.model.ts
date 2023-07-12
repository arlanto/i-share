import { model, Schema } from 'mongoose'
import { UserModel } from '~/interfaces/user.interface'

const UserSchema = new Schema<UserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const User = model<UserModel>('User', UserSchema)
