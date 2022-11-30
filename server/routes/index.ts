import { Express } from 'express'
import { authRouter } from './auth'
import { expenseRouter } from './expense'
import { userRouter } from './user'

const routes = (app: Express) => {
  app.use('/auth', authRouter)
  app.use('/user', userRouter)
  app.use('/expense', expenseRouter)
}

export default routes
