import path from 'path'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { param, body, CustomValidator } from 'express-validator'
import { Types } from 'mongoose'
import { authService } from '../services'
import { Expense } from '../models'
import { validate } from '../helpers'

async function addExpenseHandler(req: Request, res: Response) {
  try {
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

async function getUserExpensesHandler(req: Request, res: Response) {
  try {
    const userExpenses = await Expense.find({
      users: { $in: [req.params.userid] }
    })
      .select('-imageFile')
      .populate({ path: 'users', select: 'name email' })
    return res.status(httpStatus.OK).json(userExpenses)
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

const getUserExpensesValidators = [
  param('userid')
    .exists()
    .withMessage('provide a userid')
    .custom(value => Types.ObjectId.isValid(value))
    .withMessage('enter a valid userid')
]

export default {
  addExpense: [authService.authJWT, validate(addExpenseValidators), addExpenseHandler],
  getUserExpenses: [
    authService.authJWT,
    validate(getUserExpensesValidators),
    getUserExpensesHandler
  ]
}
