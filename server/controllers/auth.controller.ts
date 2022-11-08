import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { User } from '../models'

export async function signUp(req: Request, res: Response) {
  try {
    const user = await User.create(req.body)
    return res.status(httpStatus.CREATED).json(user.toAuthJSON())
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json(error)
  }
}
