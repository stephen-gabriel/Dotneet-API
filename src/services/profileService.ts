/**
 * Profile Services
 * Public API services for profile discovery and search
 */

import { prisma } from '../utils/prisma';
import {
  profileQuerySchema,
  profileHandleSchema,
  handleAvailabilitySchema,
} from '../utils/validation';
import { logger } from '../utils/logger';
import { z } from 'zod';

/**
 * GET /api/v1/profiles
 * Paginated list of public profiles with filtering and search
 */
export async function getProfiles(query: z.infer<typeof profileQuerySchema>) {
  const startTime = Date.now();
  const skip = (query.page - 1) * query.limit;
  const take = query.limit;

  const where: any = {};
  if (query.q) {
    where.OR = [
      { displayName: { contains: query.q, mode: 'insensitive' } },
      { bio: { contains: query.q, mode: 'insensitive' } },
    ];
  }

  const result = await prisma.profile.findMany({
    skip,
    take,
    where,
    include: {
      identity: {
        select: {
          handle: true,
          fullHandle: true,
        },
      },
    },
    orderBy: query.sort === 'handle:asc' ? { identity: { handle: 'asc' } } :
             query.sort === 'handle:desc' ? { identity: { handle: 'desc' } } :
             query.sort === 'createdAt:asc' ? { createdAt: 'asc' } : { createdAt: 'desc' },
  });

  const total = await prisma.profile.count({ where });

  const profiles = result.map((p) => ({
    id: p.id,
    identity: p.identity?.handle || p.identity?.fullHandle,
    displayName: p.displayName,
    bio: p.bio,
    avatarUrl: p.avatarUrl,
    createdAt: p.createdAt,
  }));

  logger.info('Profiles listed', {
    page: query.page,
    limit: query.limit,
    count: profiles.length,
    total,
    durationMs: Date.now() - startTime,
  });

  return {
    profiles,
    pagination: {
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

/**
 * GET /api/v1/profiles/:handle
 * Get single public profile by handle
 */
export async function getProfileByHandle(handle: string) {
  const startTime = Date.now();
  const parsed = profileHandleSchema.parse({ handle });

  const profile = await prisma.profile.findFirst({
    where: { identity: { handle: parsed.handle } },
    include: {
      identity: {
        select: {
          handle: true,
          fullHandle: true,
        },
      },
    },
  });

  if (!profile) {
    logger.info('Profile not found', { handle: parsed.handle });
    return null;
  }

  const receipts: any[] = [];

  logger.info('Profile fetched', { handle: parsed.handle, durationMs: Date.now() - startTime });

  return {
    id: profile.id,
    handle: profile.identity?.handle,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    createdAt: profile.createdAt,
    receipts,
  };
}

/**
 * GET /api/v1/handles/:handle
 * Check handle availability
 */
export async function checkAvailability(handle: string) {
  const startTime = Date.now();
  const parsed = handleAvailabilitySchema.parse({ handle });

  const existing = await prisma.identity.findUnique({
    where: { handle: parsed.handle },
  });

  const available = !existing;

  logger.info('Handle availability checked', { handle: parsed.handle, available, durationMs: Date.now() - startTime });

  return {
    handle: parsed.handle,
    network: 'nimiq',
    available,
    reservedForLegacyOwner: false,
  };
}
