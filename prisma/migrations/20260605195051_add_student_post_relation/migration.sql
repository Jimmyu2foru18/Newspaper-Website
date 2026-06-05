-- CreateTable
CREATE TABLE "StudentPost" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentPost" ADD CONSTRAINT "StudentPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
