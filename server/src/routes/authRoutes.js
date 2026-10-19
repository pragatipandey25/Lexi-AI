import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updateApiKey,
  getSystemStatus,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/system-status', getSystemStatus);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/api-key', protect, updateApiKey);

export default router;
