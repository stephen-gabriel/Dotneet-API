/**
 * Health Check Routes
 * Database connectivity and service status
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';
import { healthCors } from '../middleware/cors';

const router = Router();

/**
 * GET /api/health
 * Basic health check - database connectivity
 */
router.get(
  '/health',
  healthCors,
  asyncHandler(async (_req: Request, res: Response) => {
    const startTime = Date.now();

    // Check database connectivity
    let dbStatus = 'ok';
    let dbLatency = 0;
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
    } catch {
      dbStatus = 'error';
    }

    const status = dbStatus === 'ok' ? 'ok' : 'degraded';
    const duration = Date.now() - startTime;

    logger.debug('Health check', { status, dbLatency, duration });

    res.status(status === 'ok' ? 200 : 503).json({
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatency,
        },
      },
      version: process.env.npm_package_version ?? '1.0.0',
    });
  })
);

/**
 * GET /api/health/ready
 * Readiness check for Kubernetes/load balancers
 */
router.get(
  '/health/ready',
  healthCors,
  asyncHandler(async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ ready: true });
    } catch {
      res.status(503).json({ ready: false });
    }
  })
);

/**
 * GET /api/health/live
 * Liveness check
 */
router.get(
  '/health/live',
  healthCors,
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({ alive: true });
  })
);

export default router;