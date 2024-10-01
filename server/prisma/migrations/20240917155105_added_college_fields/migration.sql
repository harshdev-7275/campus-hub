/*
  Warnings:

  - The `college` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT,
ADD COLUMN     "type" TEXT,
DROP COLUMN "college",
ADD COLUMN     "college" TEXT;
