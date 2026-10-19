import express from 'express';
import {
  runAnalysis,
  getAnalysis,
  getRisks,
  getClauses,
  getExplanation,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/:documentId')
  .post(runAnalysis)
  .get(getAnalysis);

router.get('/:documentId/risks', getRisks);
router.get('/:documentId/clauses', getClauses);
router.get('/:documentId/explain', getExplanation);

export default router;
