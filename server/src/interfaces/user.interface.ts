import { Types } from 'mongoose'

export interface Payload {
  email: string
  password: string
}

export interface UserModel extends Payload {
  username: string
  tokens?: { token: string }[]
}

export interface CreateUser extends UserModel {
  confirm: string
}

export interface IUser extends UserModel {
  _id: Types.ObjectId
}

export type UpdateUser = Partial<CreateUser>
