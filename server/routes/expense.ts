import { Router } from 'express'
import expenseHandlers from '../controllers/expense.controller'

const expenseRouter = Router()

expenseRouter.post('/', ...expenseHandlers.addExpense)

expenseRouter.get('/all/:userid', ...expenseHandlers.getUserExpenses)

expenseRouter.get('/:expenseId', ...expenseHandlers.getExpense)

expenseRouter.patch('/:expenseId', ...expenseHandlers.updateExpense)

expenseRouter.delete('/:expenseId', ...expenseHandlers.deleteExpense)

export { expenseRouter }
