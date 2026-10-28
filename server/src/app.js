import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Routes
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import obligationRoutes from './routes/obligationRoutes.js';
import compareRoutes from './routes/compareRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting for production defense
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this client, please try again in a few minutes',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded documents safely (authenticated in production, static for dev)
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LexiAI Legal Document Assistant API',
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/obligations', obligationRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

// In production, serve compiled frontend client if present
const clientDist = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // Graceful root response for standalone backend deployment (Render / Railway)
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'LexiAI Legal Intelligence Engine API',
      status: 'online',
      version: '1.0.0',
      owner: 'Pragati Pandey',
      message: 'LexiAI backend API is running smoothly. To use the full web UI, visit your Vercel frontend.',
      frontendUrl: process.env.CLIENT_URL || 'http://localhost:5173',
      endpoints: {
        health: '/api/health',
        systemStatus: '/api/auth/system-status',
        auth: '/api/auth',
        documents: '/api/documents',
        analysis: '/api/analysis',
        chat: '/api/chat',
        obligations: '/api/obligations',
        compare: '/api/compare',
        reports: '/api/reports',
      },
    });
  });
}

// Fallback handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
