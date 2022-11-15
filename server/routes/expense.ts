import { Router } from 'express'
import expenseHandlers from '../controllers/expense.controller'

const expenseRouter = Router()

expenseRouter.post('/addExpense', ...expenseHandlers.addExpense)

expenseRouter.get('/getUserExpenses/:userid', ...expenseHandlers.getUserExpenses)

export { expenseRouter }
