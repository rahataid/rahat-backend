-- CreateEnum
CREATE TYPE "OfframpStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "OfframpProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "OfframpProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_offramps" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "senderAddress" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "requestId" TEXT,
    "escrowAddress" TEXT,
    "status" "OfframpStatus" NOT NULL DEFAULT 'PENDING',
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tbl_offramps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_offramp_transactions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "txHash" TEXT,
    "walletId" TEXT,
    "customerKey" TEXT,
    "chain" TEXT,
    "token" TEXT,
    "referenceId" TEXT,
    "status" "OfframpStatus" NOT NULL DEFAULT 'PENDING',
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tbl_offramp_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfframpProvider_name_key" ON "OfframpProvider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_offramps_uuid_key" ON "tbl_offramps"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_offramps_requestId_key" ON "tbl_offramps"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_offramp_transactions_uuid_key" ON "tbl_offramp_transactions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_offramp_transactions_requestId_key" ON "tbl_offramp_transactions"("requestId");

-- AddForeignKey
ALTER TABLE "tbl_offramp_transactions" ADD CONSTRAINT "tbl_offramp_transactions_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "tbl_offramps"("requestId") ON DELETE RESTRICT ON UPDATE CASCADE;
