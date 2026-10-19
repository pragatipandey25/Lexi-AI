import express from 'express';
import { downloadReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:documentId', downloadReport);

export default router;
