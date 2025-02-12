/*
  Warnings:

  - Made the column `txHash` on table `tbl_offramp_transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tbl_offramp_transactions" ALTER COLUMN "txHash" SET NOT NULL;
