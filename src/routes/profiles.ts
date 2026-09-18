/**
 * Profile Routes
 * Public API endpoints for profile discovery and search
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { profileService } from '../services/profileService';
import { prisma } from '../utils/prisma';
import {
  profileQuerySchema,
  profileHandleSchema,
  handleAvailabilitySchema,
  receiptIdSchema,
} from '../utils/validation';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/v1/profiles
 * Paginated list of public profiles with filtering and search
 */
router.get(
  '/profiles',
  asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    const query = profileQuerySchema.parse(req.query);
    const result = await profileService.getProfiles(query);

    logger.info('Profiles listed', {
      page: query.page,
      limit: query.limit,
      count: result.profiles.length,
      total: result.pagination.total,
      durationMs: Date.now() - startTime,
    });

    res.setHeader('X-Total-Count', result.pagination.total.toString());
    res.setHeader('X-Page-Count', result.pagination.totalPages.toString());

    res.json({
      profiles: result.profiles,
      pagination: result.pagination,
    });
  })
);

/**
 * GET /api/v1/profiles/:handle
 * Get single public profile by handle
 */
router.get(
  '/profiles/:handle',
  asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    const { handle } = profileHandleSchema.parse(req.params);
    const profile = await profileService.getProfileByHandle(handle);

    if (!profile) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Profile not found or has no published receipts',
        },
      });
    }

    logger.info('Profile fetched', { handle, durationMs: Date.now() - startTime });
    res.json(profile);
  })
);

/**
 * GET /api/v1/handles/:handle
 * Check handle availability
 */
router.get(
  '/handles/:handle',
  asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    const { handle } = handleAvailabilitySchema.parse(req.params);
    const result = await profileService.checkAvailability(handle);

    logger.info('Handle availability checked', { handle, available: result.available, durationMs: Date.now() - startTime });
    res.json(result);
  })
);

/**
 * GET /api/v1/receipts/:id
 * Get single public receipt by ID
 */
router.get(
  '/receipts/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const startTime = Date.now();
    const { id } = receiptIdSchema.parse(req.params);

    const receipt = await prisma.contributionReceipt.findUnique({
      where: { id },
      include: {
        issuer: { select: { handle: true, address: true } },
        recipient: { select: { handle: true, address: true } },
      },
    });

    if (!receipt || !receipt.publishedAt || !receipt.signatureVerifiedAt || !receipt.paymentVerifiedAt) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Receipt not found or not published',
        },
      });
    }

    logger.info('Receipt fetched', { id, durationMs: Date.now() - startTime });

    res.json({
      receipt: {
        id: receipt.id,
        statement: receipt.statement,
        amountLuna: receipt.amountLuna.toString(),
        evidenceUrl: receipt.evidenceUrl,
        issuerHandle: receipt.issuer.handle,
        issuerAddress: receipt.issuer.address,
        recipientHandle: receipt.recipient.handle,
        recipientAddress: receipt.recipient.address,
        network: receipt.network,
        createdAt: receipt.createdAt.toISOString(),
        publishedAt: receipt.publishedAt?.toISOString() ?? null,
        transactionHash: receipt.transactionHash,
        paymentVerifiedAt: receipt.paymentVerifiedAt?.toISOString() ?? null,
        signatureVerifiedAt: receipt.signatureVerifiedAt?.toISOString() ?? null,
        withdrawnAt: receipt.withdrawnAt?.toISOString() ?? null,
        confirmationCount: receipt.confirmationCount,
        verificationPolicy: receipt.verificationPolicy,
      },
    });
  })
);

export default router;