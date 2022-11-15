import { Router } from 'express'
import userHandlers from '../controllers/user.controller'

const userRouter = Router()

userRouter.get('/getUsers', ...userHandlers.getUsers)

export { userRouter }
