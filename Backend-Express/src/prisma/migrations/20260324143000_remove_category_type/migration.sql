-- Remove category type. Transaction and Schedule keep the type responsibility.
ALTER TABLE `Category`
DROP COLUMN `type`;
