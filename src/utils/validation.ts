/**
 * Validation schemas using Zod
 * Ensures request payloads and query params are properly validated
 */

import { z } from 'zod';

/**
 * Profile query parameters for GET /api/v1/profiles
 */
export const profileQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  q: z.string().trim().max(100).optional(),
  network: z.string().optional(),
  hasReceipts: z.coerce.boolean().default(false),
  sort: z
    .enum(['createdAt:asc', 'createdAt:desc', 'handle:asc', 'handle:desc'])
    .default('createdAt:desc'),
});

export type ProfileQuery = z.infer<typeof profileQuerySchema>;

/**
 * Handle availability query params
 */
export const handleAvailabilitySchema = z.object({
  handle: z.string().min(1).max(37),
});

export type HandleAvailabilityParams = z.infer<typeof handleAvailabilitySchema>;

/**
 * Receipt ID params
 */
export const receiptIdSchema = z.object({
  id: z.string().cuid(),
});

export type ReceiptIdParams = z.infer<typeof receiptIdSchema>;

/**
 * Profile handle params
 */
export const profileHandleSchema = z.object({
  handle: z.string().min(1).max(37),
});

export type ProfileHandleParams = z.infer<typeof profileHandleSchema>;

/**
 * Response schemas for documentation
 */
export const profileSummarySchema = z.object({
  displayedPublicReceipts: z.number().int().nonnegative(),
  activeDisplayedReceipts: z.number().int().nonnegative(),
  distinctDisplayedIssuerWallets: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
});

export type ProfileSummary = z.infer<typeof profileSummarySchema>;

export const publicProfileSchema = z.object({
  id: z.string().cuid(),
  handle: z.string(),
  displayName: z.string().nullable(),
  bio: z.string().nullable(),
  address: z.string(),
  network: z.string(),
  createdAt: z.string().datetime(),
  receipts: z.array(
    z.object({
      id: z.string().cuid(),
      statement: z.string(),
      amountLuna: z.string(),
      evidenceUrl: z.string().nullable(),
      issuerHandle: z.string(),
      issuerAddress: z.string(),
      recipientHandle: z.string(),
      recipientAddress: z.string(),
      network: z.string(),
      createdAt: z.string().datetime(),
      publishedAt: z.string().datetime().nullable(),
      transactionHash: z.string().nullable(),
      paymentVerifiedAt: z.string().datetime().nullable(),
      signatureVerifiedAt: z.string().datetime().nullable(),
      withdrawnAt: z.string().datetime().nullable(),
      confirmationCount: z.number().int().nullable(),
      verificationPolicy: z.string().nullable(),
    })
  ),
  summary: profileSummarySchema,
});

export type PublicProfileResponse = z.infer<typeof publicProfileSchema>;

export const handleAvailabilityResponseSchema = z.object({
  handle: z.string(),
  network: z.string(),
  available: z.boolean(),
  reservedForLegacyOwner: z.boolean().optional(),
});

export type HandleAvailabilityResponse = z.infer<typeof handleAvailabilityResponseSchema>;

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;