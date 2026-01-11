import { Router } from 'express';
import {
  getFuelLogs,
  createFuelLog,
  deleteFuelLog,
  getFuelAverage,
} from '../controllers/fuelLogController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Fuel Logs
 *   description: Fuel consumption tracking endpoints
 */

/**
 * @swagger
 * /api/cars/{carId}/fuel-logs:
 *   get:
 *     summary: Get fuel logs for a car
 *     description: Retrieve all fuel log records for a specific car
 *     tags: [Fuel Logs]
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
 *         description: Fuel log records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FuelLog'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:carId/fuel-logs', getFuelLogs);

/**
 * @swagger
 * /api/cars/{carId}/fuel-average:
 *   get:
 *     summary: Get fuel consumption average
 *     description: Calculate average fuel consumption for a specific car
 *     tags: [Fuel Logs]
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
 *         description: Fuel average calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuelAverage'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:carId/fuel-average', getFuelAverage);

/**
 * @swagger
 * /api/cars/{carId}/fuel-logs:
 *   post:
 *     summary: Create a fuel log record
 *     description: Add a new fuel log record for a specific car
 *     tags: [Fuel Logs]
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
 *               - liters
 *               - cost
 *               - pricePerLiter
 *               - fuelType
 *               - fullTank
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               mileage:
 *                 type: number
 *                 example: 25000
 *               liters:
 *                 type: number
 *                 example: 40.5
 *               cost:
 *                 type: number
 *                 example: 60.75
 *               pricePerLiter:
 *                 type: number
 *                 example: 1.50
 *               fuelType:
 *                 type: string
 *                 enum: [Regular, Premium, Diesel, Electric]
 *                 example: Regular
 *               fullTank:
 *                 type: boolean
 *                 example: true
 *               notes:
 *                 type: string
 *                 example: Gas station on Main St
 *     responses:
 *       201:
 *         description: Fuel log record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FuelLog'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:carId/fuel-logs', createFuelLog);

/**
 * @swagger
 * /api/cars/fuel-logs/{id}:
 *   delete:
 *     summary: Delete a fuel log record
 *     description: Remove a fuel log record from the system
 *     tags: [Fuel Logs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The fuel log record ID
 *     responses:
 *       204:
 *         description: Fuel log record deleted successfully
 *       404:
 *         description: Fuel log record not found
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
router.delete('/fuel-logs/:id', deleteFuelLog);

export default router;
