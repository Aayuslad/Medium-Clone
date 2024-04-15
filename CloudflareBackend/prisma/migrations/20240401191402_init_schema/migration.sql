-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topics" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "Topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToTopics" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Topics_topic_key" ON "Topics"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTopics_AB_unique" ON "_PostToTopics"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTopics_B_index" ON "_PostToTopics"("B");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTopics" ADD CONSTRAINT "_PostToTopics_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTopics" ADD CONSTRAINT "_PostToTopics_B_fkey" FOREIGN KEY ("B") REFERENCES "Topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
