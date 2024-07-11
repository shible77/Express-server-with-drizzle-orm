CREATE TABLE `verify_user` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(256) NOT NULL,
	`email` varchar(256) NOT NULL,
	`password` varchar(256) NOT NULL,
	`verification_code` varchar(7) NOT NULL,
	CONSTRAINT `verify_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `verify_user_username_unique` UNIQUE(`username`),
	CONSTRAINT `verify_user_email_unique` UNIQUE(`email`)
);
