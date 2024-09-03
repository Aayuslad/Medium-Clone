/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Story` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "coverImage",
ADD COLUMN     "coverImg" TEXT NOT NULL DEFAULT '';
