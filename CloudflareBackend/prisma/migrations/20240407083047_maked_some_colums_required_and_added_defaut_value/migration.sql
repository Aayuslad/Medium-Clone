/*
  Warnings:

  - Made the column `title` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `coverImage` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postedOn` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `about` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DEFAULT '',
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "coverImage" SET NOT NULL,
ALTER COLUMN "coverImage" SET DEFAULT '',
ALTER COLUMN "postedOn" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "about" SET NOT NULL,
ALTER COLUMN "about" SET DEFAULT '',
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "bio" SET DEFAULT '';
