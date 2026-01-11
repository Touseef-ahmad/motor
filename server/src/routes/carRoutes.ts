import { Router } from 'express';
import {
  getCarDetails,
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car management endpoints
 */

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars
 *     description: Retrieve a list of all cars
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: List of cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarDetails'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAllCars);

/**
 * @swagger
 * /api/cars/{carId}:
 *   get:
 *     summary: Get car details
 *     description: Retrieve detailed information about a specific car including oil changes, fuel logs, and expenses
 *     tags: [Cars]
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
 *         description: Car details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarDetails'
 *       404:
 *         description: Car not found
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
router.get('/:carId', getCarDetails);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Create a new car
 *     description: Add a new car to the system
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - make
 *               - model
 *               - year
 *               - color
 *               - licensePlate
 *               - currentMileage
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Honda
 *               make:
 *                 type: string
 *                 example: Honda
 *               model:
 *                 type: string
 *                 example: Civic
 *               year:
 *                 type: integer
 *                 example: 2020
 *               color:
 *                 type: string
 *                 example: Blue
 *               licensePlate:
 *                 type: string
 *                 example: ABC-1234
 *               vin:
 *                 type: string
 *                 example: 1HGBH41JXMN109186
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2020-01-15
 *               currentMileage:
 *                 type: number
 *                 example: 25000
 *               emoji:
 *                 type: string
 *                 example: 🚗
 *               backgroundStyle:
 *                 type: string
 *                 enum: [solid, gradient, animated]
 *                 example: gradient
 *               backgroundColor:
 *                 type: string
 *                 example: "#007AFF"
 *               secondaryColor:
 *                 type: string
 *                 example: "#00C7FF"
 *     responses:
 *       201:
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarDetails'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createCar);

/**
 * @swagger
 * /api/cars/{carId}:
 *   put:
 *     summary: Update a car
 *     description: Update information for an existing car
 *     tags: [Cars]
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
 *             properties:
 *               name:
 *                 type: string
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               color:
 *                 type: string
 *               licensePlate:
 *                 type: string
 *               vin:
 *                 type: string
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *               currentMileage:
 *                 type: number
 *               emoji:
 *                 type: string
 *               backgroundStyle:
 *                 type: string
 *                 enum: [solid, gradient, animated]
 *               backgroundColor:
 *                 type: string
 *               secondaryColor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarDetails'
 *       404:
 *         description: Car not found
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
router.put('/:carId', updateCar);

/**
 * @swagger
 * /api/cars/{carId}:
 *   delete:
 *     summary: Delete a car
 *     description: Remove a car from the system
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The car ID
 *     responses:
 *       204:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
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
router.delete('/:carId', deleteCar);

export default router;
