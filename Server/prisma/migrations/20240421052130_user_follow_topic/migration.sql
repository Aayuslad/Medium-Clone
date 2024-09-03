-- AlterTable
ALTER TABLE "Topics" ADD COLUMN     "followersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "storiesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FollowedTopic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "FollowedTopic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FollowedTopic" ADD CONSTRAINT "FollowedTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedTopic" ADD CONSTRAINT "FollowedTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
