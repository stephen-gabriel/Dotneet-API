-- CreateTable
CREATE TABLE "WalletProfile" (
    "id" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthChallenge" (
    "id" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "bindingHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionReceipt" (
    "id" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "issuerAddress" TEXT NOT NULL,
    "recipientAddress" TEXT NOT NULL,
    "amountLuna" BIGINT NOT NULL,
    "statement" TEXT NOT NULL,
    "evidenceUrl" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "paymentState" TEXT NOT NULL DEFAULT 'DRAFT',
    "paymentAttemptAt" TIMESTAMP(3),
    "paymentAttemptId" TEXT,
    "transactionHash" TEXT,
    "paymentVerifiedAt" TIMESTAMP(3),
    "paymentBlock" INTEGER,
    "confirmationCount" INTEGER,
    "verificationPolicy" TEXT,
    "acknowledgmentMessage" TEXT,
    "acknowledgmentExpiresAt" TIMESTAMP(3),
    "acknowledgmentPublicKey" TEXT,
    "acknowledgmentSignature" TEXT,
    "signatureVerifiedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributionReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletProfile_network_address_key" ON "WalletProfile"("network", "address");

-- CreateIndex
CREATE UNIQUE INDEX "WalletProfile_network_handle_key" ON "WalletProfile"("network", "handle");

-- CreateIndex
CREATE INDEX "AuthChallenge_expiresAt_idx" ON "AuthChallenge"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "WalletSession_tokenHash_key" ON "WalletSession"("tokenHash");

-- CreateIndex
CREATE INDEX "WalletSession_expiresAt_idx" ON "WalletSession"("expiresAt");

-- CreateIndex
CREATE INDEX "ContributionReceipt_recipientId_publishedAt_idx" ON "ContributionReceipt"("recipientId", "publishedAt");

-- CreateIndex
CREATE INDEX "ContributionReceipt_issuerId_createdAt_idx" ON "ContributionReceipt"("issuerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionReceipt_network_transactionHash_key" ON "ContributionReceipt"("network", "transactionHash");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionReceipt_issuerId_idempotencyKey_key" ON "ContributionReceipt"("issuerId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "RateLimitBucket_resetAt_idx" ON "RateLimitBucket"("resetAt");

-- AddForeignKey
ALTER TABLE "ContributionReceipt" ADD CONSTRAINT "ContributionReceipt_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "WalletProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionReceipt" ADD CONSTRAINT "ContributionReceipt_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "WalletProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

