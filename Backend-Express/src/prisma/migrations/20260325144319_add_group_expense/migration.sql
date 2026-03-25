-- DropForeignKey
ALTER TABLE `GroupExpenseShare` DROP FOREIGN KEY `GroupExpenseShare_groupExpenseId_fkey`;

-- DropIndex
DROP INDEX `GroupExpenseShare_groupExpenseId_idx` ON `GroupExpenseShare`;

-- AddForeignKey
ALTER TABLE `GroupExpenseShare` ADD CONSTRAINT `GroupExpenseShare_groupExpenseId_fkey` FOREIGN KEY (`groupExpenseId`) REFERENCES `GroupExpense`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
