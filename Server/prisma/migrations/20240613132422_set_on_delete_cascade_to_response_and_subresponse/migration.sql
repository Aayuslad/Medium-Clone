-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_storyId_fkey";

-- DropForeignKey
ALTER TABLE "SubResponse" DROP CONSTRAINT "SubResponse_responseId_fkey";

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubResponse" ADD CONSTRAINT "SubResponse_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
