-- DropForeignKey
ALTER TABLE "ReadingHistory" DROP CONSTRAINT "ReadingHistory_storyId_fkey";

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
