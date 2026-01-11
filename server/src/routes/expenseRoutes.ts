import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  deleteExpense,
} from '../controllers/expenseController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense tracking endpoints
 */

/**
 * @swagger
 * /api/cars/{carId}/expenses:
 *   get:
 *     summary: Get expenses for a car
 *     description: Retrieve all expense records for a specific car
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The car ID
 *     responses:
 *       200:
 *         description: Expense records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:carId/expenses', getExpenses);

/**
 * @swagger
 * /api/cars/{carId}/expenses:
 *   post:
 *     summary: Create an expense record
 *     description: Add a new expense record for a specific car
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - category
 *               - description
 *               - amount
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               category:
 *                 type: string
 *                 enum: [Maintenance, Fuel, Insurance, Repair, Registration, Other]
 *                 example: Maintenance
 *               description:
 *                 type: string
 *                 example: Tire rotation
 *               amount:
 *                 type: number
 *                 example: 50.00
 *               mileage:
 *                 type: number
 *                 example: 25000
 *               notes:
 *                 type: string
 *                 example: Discount applied
 *     responses:
 *       201:
 *         description: Expense record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:carId/expenses', createExpense);

/**
 * @swagger
 * /api/cars/expenses/{id}:
 *   delete:
 *     summary: Delete an expense record
 *     description: Remove an expense record from the system
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The expense record ID
 *     responses:
 *       204:
 *         description: Expense record deleted successfully
 *       404:
 *         description: Expense record not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/expenses/:id', deleteExpense);

export default router;
