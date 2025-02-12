/*
  Warnings:

  - You are about to drop the column `accuracy` on the `tbl_kobo_beneficiaries` table. All the data in the column will be lost.
  - You are about to drop the column `altitude` on the `tbl_kobo_beneficiaries` table. All the data in the column will be lost.
  - You are about to drop the column `healthWorkerName` on the `tbl_kobo_beneficiaries` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `tbl_kobo_beneficiaries` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `tbl_kobo_beneficiaries` table. All the data in the column will be lost.
  - You are about to drop the column `meta` on the `tbl_kobo_beneficiaries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tbl_kobo_beneficiaries" DROP COLUMN "accuracy",
DROP COLUMN "altitude",
DROP COLUMN "healthWorkerName",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "meta",
ADD COLUMN     "extras" JSONB;
