import express from 'express';
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/:documentId')
  .post(sendMessage)
  .get(getChatHistory)
  .delete(clearChatHistory);

export default router;
