import { model, Schema, Types, Date } from 'mongoose'
import { IUSER } from './user'

interface IEXPENSE {
  addedBy: Types.ObjectId
  date: Date
  description: String
  imageFile: {
    file: Buffer
    fileName: String
  }
  paidBy: Types.ObjectId
  paidByMultiple: Types.DocumentArray<IUSER>
  split: String
  splitValues: Types.DocumentArray<IUSER>
  totalPrice: Number
  users: Types.DocumentArray<IUSER>
}

const expenseSchema = new Schema<IEXPENSE>({
  addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  description: String,
  imageFile: { file: Buffer, fileName: String },
  paidBy: { type: Schema.Types.ObjectId, ref: 'User' },
  paidByMultiple: [{ id: { type: Schema.Types.ObjectId, ref: 'User' }, value: Number }],
  split: String,
  splitValues: [{ id: { type: Schema.Types.ObjectId, ref: 'User' }, value: Number }],
  totalPrice: Number,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

export default model<IEXPENSE>('Expense', expenseSchema)
