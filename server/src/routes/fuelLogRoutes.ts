import { Router } from 'express';
import {
  getFuelLogs,
  createFuelLog,
  deleteFuelLog,
  getFuelAverage,
} from '../controllers/fuelLogController';

const router = Router();

router.get('/:carId/fuel-logs', getFuelLogs);
router.get('/:carId/fuel-average', getFuelAverage);
router.post('/:carId/fuel-logs', createFuelLog);
router.delete('/fuel-logs/:id', deleteFuelLog);

export default router;
