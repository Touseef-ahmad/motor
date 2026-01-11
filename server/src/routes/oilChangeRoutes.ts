import { Router } from 'express';
import {
  getOilChanges,
  createOilChange,
  deleteOilChange,
} from '../controllers/oilChangeController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Oil Changes
 *   description: Oil change tracking endpoints
 */

/**
 * @swagger
 * /api/cars/{carId}/oil-changes:
 *   get:
 *     summary: Get oil changes for a car
 *     description: Retrieve all oil change records for a specific car
 *     tags: [Oil Changes]
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
 *         description: Oil change records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OilChange'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:carId/oil-changes', getOilChanges);

/**
 * @swagger
 * /api/cars/{carId}/oil-changes:
 *   post:
 *     summary: Create an oil change record
 *     description: Add a new oil change record for a specific car
 *     tags: [Oil Changes]
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
 *               - mileage
 *               - cost
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               mileage:
 *                 type: number
 *                 example: 25000
 *               cost:
 *                 type: number
 *                 example: 45.99
 *               notes:
 *                 type: string
 *                 example: Used synthetic oil
 *               nextChangeMileage:
 *                 type: number
 *                 example: 28000
 *               nextChangeDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-07-15
 *     responses:
 *       201:
 *         description: Oil change record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OilChange'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:carId/oil-changes', createOilChange);

/**
 * @swagger
 * /api/cars/oil-changes/{id}:
 *   delete:
 *     summary: Delete an oil change record
 *     description: Remove an oil change record from the system
 *     tags: [Oil Changes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The oil change record ID
 *     responses:
 *       204:
 *         description: Oil change record deleted successfully
 *       404:
 *         description: Oil change record not found
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
router.delete('/oil-changes/:id', deleteOilChange);

export default router;
