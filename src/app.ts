/**
 * Express Application Setup
 * Configures middleware, routes, and error handling
 */

import express from 'express';
import { config } from './config';
import { logger } from './utils/logger';
import { corsMiddleware } from './middleware/cors';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler, AppError } from './middleware/errorHandler';
import profileRoutes from './routes/profiles';
import healthRoutes from './routes/health';

const app = express();

// Trust proxy for correct IP detection behind load balancers
app.set('trust proxy', true);

// Body parsing
app.use(express.json({ limit: '12kb' }));
app.use(express.urlencoded({ extended: true, limit: '12kb' }));

// CORS
app.use(corsMiddleware);

// Rate limiting
app.use(rateLimiter);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.request(req.method, req.originalUrl, res.statusCode, Date.now() - start);
  });
  next();
});

// API Routes
app.use('/api/v1', profileRoutes);
app.use('/api', healthRoutes);
app.use('/', healthRoutes);

// 404 handler
app.use((_req, _res) => {
  throw new AppError('NOT_FOUND', 'Endpoint not found', 404);
});

// Error handler (must be last)
app.use(errorHandler);

export default app;