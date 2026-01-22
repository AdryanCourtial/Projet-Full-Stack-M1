/*
  Warnings:

  - You are about to drop the column `groupId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_groupId_fkey`;

-- DropIndex
DROP INDEX `Transaction_groupId_fkey` ON `Transaction`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `groupId`;
