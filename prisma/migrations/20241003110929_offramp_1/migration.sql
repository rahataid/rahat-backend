/*
  Warnings:

  - You are about to drop the `OfframpProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "OfframpProvider";

-- CreateTable
CREATE TABLE "tbl_offramp_providers" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB NOT NULL,
    "extras" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "tbl_offramp_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tbl_offramp_providers_uuid_key" ON "tbl_offramp_providers"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_offramp_providers_name_key" ON "tbl_offramp_providers"("name");
