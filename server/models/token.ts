import { model, Schema, Types } from 'mongoose'

interface ITOKEN {
  userId: Types.ObjectId
  refreshToken: String
  tokenFamily: String
  createdAt: Date
}

const tokenSchema = new Schema<ITOKEN>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: String,
  tokenFamily: String,
  createdAt: { type: Date, default: Date.now(), expires: Date.now() * 30 * 86400 }
})

export default model<ITOKEN>('Token', tokenSchema)
