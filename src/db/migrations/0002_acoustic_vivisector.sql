DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `name` TO `username`;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(256) NOT NULL;