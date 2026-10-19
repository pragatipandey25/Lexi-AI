import express from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  renameDocument,
  deleteDocument,
  reprocessDocument,
  downloadDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSinglePdf } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All document routes are protected
router.use(protect);

router.route('/')
  .get(getDocuments);

router.post('/upload', uploadSinglePdf, uploadDocument);

router.route('/:id')
  .get(getDocumentById)
  .delete(deleteDocument);

router.put('/:id/rename', renameDocument);
router.post('/:id/reprocess', reprocessDocument);
router.get('/:id/download', downloadDocument);

export default router;
