import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists (use os.tmpdir() in serverless)
const uploadsDir = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? path.join(os.tmpdir(), 'lexiai_uploads')
  : path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {
    console.warn('[Uploads] Could not create uploads directory:', e.message);
  }
}

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate secure random prefix + sanitize extension
    const randomHex = crypto.randomBytes(16).toString('hex');
    const safeExtension = path.extname(file.originalname).toLowerCase();
    const finalName = `${Date.now()}-${randomHex}${safeExtension}`;
    cb(null, finalName);
  },
});

// File filter ensuring only PDFs are accepted
const fileFilter = (req, file, cb) => {
  const allowedMime = 'application/pdf';
  const allowedExt = '.pdf';
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.mimetype === allowedMime || ext === allowedExt) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF documents (.pdf) are supported.'), false);
  }
};

const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '15', 10);

export const uploadSinglePdf = multer({
  storage,
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024, // In bytes
  },
  fileFilter,
}).single('file');
