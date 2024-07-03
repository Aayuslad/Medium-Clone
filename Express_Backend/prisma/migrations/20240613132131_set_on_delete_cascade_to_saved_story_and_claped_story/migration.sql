-- DropForeignKey
ALTER TABLE "Clap" DROP CONSTRAINT "Clap_storyId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingHistory" DROP CONSTRAINT "ReadingHistory_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedStory" DROP CONSTRAINT "SavedStory_storyId_fkey";

-- AddForeignKey
ALTER TABLE "Clap" ADD CONSTRAINT "Clap_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedStory" ADD CONSTRAINT "SavedStory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
