import { Router } from 'express';
import {
  getOilChanges,
  createOilChange,
  deleteOilChange,
} from '../controllers/oilChangeController';

const router = Router();

router.get('/:carId/oil-changes', getOilChanges);
router.post('/:carId/oil-changes', createOilChange);
router.delete('/oil-changes/:id', deleteOilChange);

export default router;
