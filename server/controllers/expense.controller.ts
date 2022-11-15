import path from 'path'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { body, CustomValidator } from 'express-validator'
import { authService } from '../services'
import { Expense } from '../models'
import { validate } from '../helpers'

// TODO add authorization
// TODO add cors headers
async function addExpenseHandler(req: Request, res: Response) {
  try {
    // console.log(req.user)
    const expense = await Expense.create({
      ...req.body,
      paidByMultiple: req.body.paidByMultiple === '' ? [] : req.body.paidByMultiple,
      imageFile: { file: req.file!.buffer, fileName: req.file!.originalname }
    })
    return res.status(httpStatus.CREATED).json(expense.id)
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

const isImageFile: CustomValidator = (_, { req }) => {
  const extension =
    typeof req.file !== 'undefined' ? path.extname(req.file.originalname).toLowerCase() : ''
  switch (extension) {
    case '.jpg':
      return '.jpg'
    case '.jpeg':
      return '.jpeg'
    case '.png':
      return '.png'
    default:
      return false
  }
}

const addExpenseValidators = [
  body('addedBy').exists().isString().isAlphanumeric(),
  body('date').exists().isISO8601().toDate().withMessage('date is required'),
  body('description').isString(),
  body('imageFile')
    .custom(isImageFile)
    .optional({ nullable: true })
    .withMessage('Please provide an image file'),
  body('paidBy').exists().isString(),
  body('paidByMultiple').exists().isArray().optional({ nullable: true, checkFalsy: true }),
  body('split').exists().isString(),
  body('splitValues').exists().isArray({ min: 2 }),
  body('totalPrice').exists().isFloat().withMessage('totalPrice is required'),
  body('users').exists().isArray({ min: 2 })
]

export default {
  addExpense: [authService.authJWT, validate(addExpenseValidators), addExpenseHandler]
}
