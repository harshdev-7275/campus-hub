/*
  Warnings:

  - You are about to drop the column `usename` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "usename",
ADD COLUMN     "username" TEXT;
