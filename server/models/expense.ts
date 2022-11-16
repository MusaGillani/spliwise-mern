import { model, Schema, Types, Date } from 'mongoose'
import { IUSER } from '../models'

interface ICOSTOBJECT {
  userid: Types.ObjectId
  value: Number
}
export interface IEXPENSE {
  addedBy: Types.ObjectId
  date: Date
  description: String
  imageFile: {
    file: Buffer
    fileName: String
  }
  paidBy: Types.ObjectId
  paidByMultiple: Types.Array<ICOSTOBJECT>
  split: String
  splitValues: Types.Array<ICOSTOBJECT>
  totalPrice: Number
  users: Types.DocumentArray<IUSER>
}

const expenseSchema = new Schema<IEXPENSE>({
  addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  description: String,
  imageFile: { file: Buffer, fileName: String },
  paidBy: { type: Schema.Types.ObjectId, ref: 'User' },
  paidByMultiple: [
    {
      userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      value: Number,
      _id: false
    }
  ],
  split: String,
  splitValues: [
    {
      userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      value: Number,
      _id: false
    }
  ],
  totalPrice: Number,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

export default model<IEXPENSE>('Expense', expenseSchema)
