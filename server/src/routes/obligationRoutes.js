import express from 'express';
import {
  getObligations,
  updateObligationStatus,
  createObligation,
  deleteObligation,
} from '../controllers/obligationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getObligations)
  .post(createObligation);

router.put('/:id/status', updateObligationStatus);
router.delete('/:id', deleteObligation);

export default router;
