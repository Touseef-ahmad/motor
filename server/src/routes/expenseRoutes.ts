import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from '../controllers/expenseController';

const router = Router();

router.get('/:carId/expenses', getExpenses);
router.post('/:carId/expenses', createExpense);
router.delete('/expenses/:id', deleteExpense);

export default router;
