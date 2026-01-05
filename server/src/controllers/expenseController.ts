import { Request, Response } from 'express';
import { Expense } from '../models';

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const expenses = await Expense.findAll({
      where: { carId },
      order: [['date', 'DESC']],
    });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const expense = await Expense.create({
      ...req.body,
      carId,
    });
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await expense.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
