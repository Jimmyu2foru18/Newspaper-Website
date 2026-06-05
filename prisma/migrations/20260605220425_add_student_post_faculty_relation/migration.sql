-- AlterTable
ALTER TABLE "StudentPost" ADD COLUMN     "facultyId" TEXT;

-- AddForeignKey
ALTER TABLE "StudentPost" ADD CONSTRAINT "StudentPost_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
