/**
 * Server Entry Point
 * Starts the Express server with graceful shutdown
 */

import { config } from './config';
import { logger } from './utils/logger';
import app from './app';
import { prisma } from './utils/prisma';

const server = app.listen(config.server.port, () => {
  logger.info('🚀 Dotneet API server started', {
    port: config.server.port,
    env: config.server.env,
    cors: config.cors.allowedOrigins,
  });
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await prisma.$disconnect();
      logger.info('Database connections closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown', { error: err });
      process.exit(1);
    }
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
});