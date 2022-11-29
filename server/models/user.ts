import { model, Schema, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { hashSync, compareSync } from 'bcrypt'
import { jwtService } from '../services'

export interface IUSER {
  name: string
  email: string
  password: string
}

interface IUserMethods {
  _hashPassword(password: string): string
  authenticateUser(password: string): boolean
  toAuthJSON(): Promise<{
    _id: string
    name: string
    token: string
  }>
  toJSON(): {
    _id: string
    name: string
  }
}

type UserModel = Model<IUSER, {}, IUserMethods>

const userSchema = new Schema<IUSER, UserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, 'FirstName is required!'],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    trim: true,
    minlength: [6, 'Password need to be longer!']
  }
})

userSchema.plugin(uniqueValidator, {
  message: '{VALUE} is already taken!'
})

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this._hashPassword(this.password)
  }

  return next()
})

userSchema.methods = {
  _hashPassword(password: string) {
    return hashSync(password, 2)
  },
  authenticateUser(password: string) {
    return compareSync(password, this.password)
  },
  async toAuthJSON() {
    return {
      _id: this._id,
      name: this.name,
      token: `${jwtService.generateToken({ _id: this._id }, '20s')}`,
      refreshToken: `${await jwtService.createRefreshToken(this._id)}`
    }
  },
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email
    }
  }
}

export default model<IUSER, UserModel>('User', userSchema)
