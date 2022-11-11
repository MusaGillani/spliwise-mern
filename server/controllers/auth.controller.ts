import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { body, validationResult } from 'express-validator'
import { User } from '../models'

async function signUpHandler(req: Request, res: Response) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw errors
    }
    const user = await User.create(req.body)
    return res.status(httpStatus.CREATED).json(user.toAuthJSON())
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error)
  }
}

const signUpValidator = [
  body('name').exists(),
  body('email').isEmail().withMessage('Must be an email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characterse')
]

export default {
  signUp: [...signUpValidator, signUpHandler]
}
