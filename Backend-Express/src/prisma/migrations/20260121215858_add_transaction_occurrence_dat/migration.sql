/*
  Warnings:

  - A unique constraint covering the columns `[scheduleId,occurrenceDate]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `occurrenceDate` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Transaction_scheduleId_occurrenceDate_key` ON `Transaction`(`scheduleId`, `occurrenceDate`);
