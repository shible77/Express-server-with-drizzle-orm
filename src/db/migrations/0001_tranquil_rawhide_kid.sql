CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`product_name` varchar(100) NOT NULL,
	`product_description` varchar(250) NOT NULL,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_product_name_unique` UNIQUE(`product_name`)
);
