/*
  Warnings:

  - You are about to drop the column `published` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `ResearchPaper` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Video` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "published",
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "published",
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ResearchPaper" DROP COLUMN "published",
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "facultyId" TEXT;

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "published",
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
