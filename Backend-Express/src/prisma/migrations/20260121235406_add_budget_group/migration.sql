-- AlterTable
ALTER TABLE `Budget` ADD COLUMN `groupId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
