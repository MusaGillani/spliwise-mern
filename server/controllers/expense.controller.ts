import path from 'path'
import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { param, body, CustomValidator } from 'express-validator'
import { Types } from 'mongoose'
import { authService } from '../services'
import { Expense, IEXPENSE } from '../models'
import { validate } from '../helpers'

async function addExpenseHandler(req: Request, res: Response) {
  try {
    const expense = await Expense.create({
      ...req.body,
      paidBy: req.body.paidBy === 'multiple' ? null : req.body.paidBy,
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
  body('paidBy')
    .exists()
    .isString()
    .custom(value => (value !== 'multiple' ? Types.ObjectId.isValid(value) : true))
    .withMessage('Provide a correct userId in paidBy'),
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

async function getExpenseHandler(req: Request, res: Response) {
  try {
    const expense = await Expense.findById(req.params.expenseId).select('-imageFile')
    if (!expense) return res.status(httpStatus.NOT_FOUND).json({ message: 'Expense Not found' })
    return res.status(httpStatus.OK).json(expense)
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

const getExpenseValidators = [
  param('expenseId')
    .exists()
    .withMessage('provide an expenseId')
    .custom(value => Types.ObjectId.isValid(value))
    .withMessage('provide a valid expenseId')
]

async function updateExpenseHandler(req: Request, res: Response) {
  try {
    const expense: IEXPENSE | null = await Expense.findById(req.params.expenseId)
    if (!expense) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Expense Not found' })
    }
    const { users, splitValues, paidBy, paidByMultiple } = expense!
    const { userId } = req.body

    let updatedUsers: any[] = users.filter(user => !user.equals(userId))
    let updatedSplitValues: any[] = splitValues.filter(obj => !obj.userid.equals(userId))
    let updatedPaidByMultiple: any[] = paidByMultiple
    if (paidBy === null)
      updatedPaidByMultiple = paidByMultiple.filter(obj => !obj.userid.equals(userId))

    await Expense.findByIdAndUpdate(req.params.expenseId, {
      users: updatedUsers,
      splitValues: updatedSplitValues,
      paidByMultiple: updatedPaidByMultiple
    })
    return res.sendStatus(httpStatus.NO_CONTENT)
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

const updateExpenseValidators = [
  param('expenseId')
    .exists()
    .withMessage('provide an expenseId')
    .custom(value => Types.ObjectId.isValid(value))
    .withMessage('enter a valid expenseId'),
  body('userId')
    .exists()
    .withMessage('provide a userId')
    .custom(value => Types.ObjectId.isValid(value))
    .withMessage('provide a valid userId')
]

async function deleteExpenseHandler(req: Request, res: Response) {
  try {
    const deletedDoc = await Expense.findByIdAndDelete(req.params.expenseId)
    if (!deletedDoc) return res.status(httpStatus.NOT_FOUND).json({ message: 'Expense Not found' })
    return res.sendStatus(httpStatus.NO_CONTENT)
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

const deleteExpenseValidators = [
  param('expenseId')
    .exists()
    .withMessage('provide an expenseId')
    .custom(value => Types.ObjectId.isValid(value))
    .withMessage('enter a valid expenseId')
]

export default {
  addExpense: [authService.authJWT, validate(addExpenseValidators), addExpenseHandler],
  getUserExpenses: [
    authService.authJWT,
    validate(getUserExpensesValidators),
    getUserExpensesHandler
  ],
  getExpense: [authService.authJWT, validate(getExpenseValidators), getExpenseHandler],
  updateExpense: [authService.authJWT, validate(updateExpenseValidators), updateExpenseHandler],
  deleteExpense: [authService.authJWT, validate(deleteExpenseValidators), deleteExpenseHandler]
}
