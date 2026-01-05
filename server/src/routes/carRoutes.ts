import { Router } from 'express';
import {
  getCarDetails,
  getAllCars,
  createCar,
  updateCar,
  deleteCar,
} from '../controllers/carController';

const router = Router();

router.get('/', getAllCars);
router.get('/:carId', getCarDetails);
router.post('/', createCar);
router.put('/:carId', updateCar);
router.delete('/:carId', deleteCar);

export default router;
