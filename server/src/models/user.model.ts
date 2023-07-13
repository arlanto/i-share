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
    avatar: {
      type: String,
      required: false,
      default: 'user.png',
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

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, prop) {
    delete prop.password
    delete prop.tokens
    return prop
  },
})

export const User = model<UserModel>('User', UserSchema)
