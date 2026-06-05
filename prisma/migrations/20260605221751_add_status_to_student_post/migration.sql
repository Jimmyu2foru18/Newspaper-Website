-- AlterTable
ALTER TABLE "StudentPost" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING';
