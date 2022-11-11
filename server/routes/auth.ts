import { Router } from 'express'
import authHandlers from '../controllers/auth.controller'

const authRouter = Router()

authRouter.post('/login')

authRouter.post('/signUp', ...authHandlers.signUp)

export { authRouter }
