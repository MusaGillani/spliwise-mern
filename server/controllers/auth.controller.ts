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

const signUpValidators = [
  body('name').exists(),
  body('email').isEmail().withMessage('Must be an email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ message: 'user does not exist' })
    else if (!user.authenticateUser(password))
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'invalid password' })
    else return res.status(httpStatus.OK).json(user.toAuthJSON())
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error)
  }
}

const loginValidators = [
  body('email').isEmail().withMessage('Must be an email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

export default {
  signUp: [...signUpValidators, signUpHandler],
  login: [...loginValidators, loginHandler]
}
