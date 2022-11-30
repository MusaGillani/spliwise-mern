import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { authService } from '../services'
import { User } from '../models'

async function getAllUsersHandler(req: Request, res: Response) {
  try {
    const users = await User.find()
    return res.status(httpStatus.OK).json(users)
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error)
  }
}

export default {
  getUsers: [authService.authJWT, getAllUsersHandler]
}
