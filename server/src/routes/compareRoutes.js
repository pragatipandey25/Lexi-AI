import express from 'express';
import { compareDocuments } from '../controllers/compareController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', compareDocuments);

export default router;
