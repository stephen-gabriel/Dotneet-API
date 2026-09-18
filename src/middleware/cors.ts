/**
 * CORS configuration
 * Allows configured origins with proper headers for public API
 */

import cors from 'cors';
import { config } from '../config';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (config.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow localhost with any port
    if (config.server.env === 'development') {
      const isLocalhost = origin.match(/^https?:\/\/localhost(:\d+)?$/);
      if (isLocalhost) {
        return callback(null, true);
      }
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  credentials: false,
  maxAge: 86400, // 24 hours
});

// Health check doesn't need CORS
export const healthCors = cors({
  origin: true,
  methods: ['GET'],
});