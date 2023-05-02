-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NULL,
    `age_range` VARCHAR(50) NULL,
    `gender` ENUM('male', 'female', 'binary', 'other') NULL,
    `country` VARCHAR(50) NULL,
    `phone` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
