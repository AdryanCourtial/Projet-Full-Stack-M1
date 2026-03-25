-- Create tricount-like group expense tables
CREATE TABLE `GroupExpense` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `groupId` INTEGER NOT NULL,
  `paidByUserId` INTEGER NOT NULL,
  `amount` DOUBLE NOT NULL,
  `description` VARCHAR(191) NULL,
  `date` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `GroupExpense_groupId_idx`(`groupId`),
  INDEX `GroupExpense_paidByUserId_idx`(`paidByUserId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `GroupExpenseShare` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `groupExpenseId` INTEGER NOT NULL,
  `userId` INTEGER NOT NULL,
  `amountOwed` DOUBLE NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `GroupExpenseShare_groupExpenseId_idx`(`groupExpenseId`),
  INDEX `GroupExpenseShare_userId_idx`(`userId`),
  UNIQUE INDEX `GroupExpenseShare_groupExpenseId_userId_key`(`groupExpenseId`, `userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `GroupExpense`
  ADD CONSTRAINT `GroupExpense_groupId_fkey`
  FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `GroupExpense`
  ADD CONSTRAINT `GroupExpense_paidByUserId_fkey`
  FOREIGN KEY (`paidByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `GroupExpenseShare`
  ADD CONSTRAINT `GroupExpenseShare_groupExpenseId_fkey`
  FOREIGN KEY (`groupExpenseId`) REFERENCES `GroupExpense`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `GroupExpenseShare`
  ADD CONSTRAINT `GroupExpenseShare_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
