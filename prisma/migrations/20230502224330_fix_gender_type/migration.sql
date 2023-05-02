/*
  Warnings:

  - The values [binary] on the enum `users_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `gender` ENUM('male', 'female', 'nonbinary', 'other') NULL;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `UQ_users_username` TO `users_username_key`;
