-- CreateTable
CREATE TABLE "MutedAuthors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "MutedAuthors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MutedAuthors" ADD CONSTRAINT "MutedAuthors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MutedAuthors" ADD CONSTRAINT "MutedAuthors_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
