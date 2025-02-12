-- CreateEnum
CREATE TYPE "KoboBeneficiaryStatus" AS ENUM(
    'PENDING',
    'FAILED',
    'SUCCESS'
);

-- AlterTable
ALTER TABLE "tbl_kobo_beneficiaries"
ADD COLUMN "status" "KoboBeneficiaryStatus" NOT NULL DEFAULT 'PENDING';