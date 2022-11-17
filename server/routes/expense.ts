import { Router } from 'express'
import expenseHandlers from '../controllers/expense.controller'

const expenseRouter = Router()

expenseRouter.post('/addExpense', ...expenseHandlers.addExpense)

expenseRouter.get('/getUserExpenses/:userid', ...expenseHandlers.getUserExpenses)

expenseRouter.get('/getExpense/:expenseId', ...expenseHandlers.getExpense)

expenseRouter.patch('/updateExpense/:expenseId', ...expenseHandlers.updateExpense)

export { expenseRouter }
