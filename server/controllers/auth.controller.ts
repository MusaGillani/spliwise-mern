import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { body } from 'express-validator'
import { User } from '../models'
import { jwtService } from '../services'
import { validate } from '../helpers'

async function signUpHandler(req: Request, res: Response) {
  try {
    const user = await User.create(req.body)
    return res.status(httpStatus.CREATED).json(await user.toAuthJSON())
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
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
    else return res.status(httpStatus.OK).json(await user.toAuthJSON())
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

const loginValidators = [
  body('email').isEmail().withMessage('Must be an email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
]

async function refreshHandler(req: Request, res: Response) {
  try {
    const token = req.headers['authorization']!.split(' ')[1]
    const payload = jwtService.verifyToken(token)
    const { userId, tokenFamily } = payload as { userId: string; tokenFamily: string }
    const isValid = await jwtService.checkIsValid(token, tokenFamily)
    if (isValid === null) {
      const reused = await jwtService.checkTokenReuse(userId, tokenFamily)
      if (reused) return res.status(httpStatus.FORBIDDEN).json('reuse detected!')
      else return res.sendStatus(httpStatus.UNAUTHORIZED)
    } else {
      const newRefreshToken = await jwtService.rotateRefreshToken(token, userId, tokenFamily)
      const newAccessToken = jwtService.generateToken({ _id: userId }, '20s')
      return res.status(httpStatus.CREATED).json({ newAccessToken, newRefreshToken })
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

function refreshValidator(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers['authorization']
    if (typeof header === 'undefined') {
      return res.sendStatus(httpStatus.UNAUTHORIZED)
    } else {
      const valid = jwtService.verifyToken(header.split(' ')[1])
      if (valid) next()
      else return res.sendStatus(httpStatus.UNAUTHORIZED)
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

export default {
  signUp: [validate(signUpValidators), signUpHandler],
  login: [validate(loginValidators), loginHandler],
  refresh: [refreshValidator, refreshHandler]
}
