-- CreateTable
CREATE TABLE "Topics" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StoryToTopics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Topics_topic_key" ON "Topics"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "_StoryToTopics_AB_unique" ON "_StoryToTopics"("A", "B");

-- CreateIndex
CREATE INDEX "_StoryToTopics_B_index" ON "_StoryToTopics"("B");

-- AddForeignKey
ALTER TABLE "_StoryToTopics" ADD CONSTRAINT "_StoryToTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryToTopics" ADD CONSTRAINT "_StoryToTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
