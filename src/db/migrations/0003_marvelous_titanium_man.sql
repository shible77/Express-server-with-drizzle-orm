CREATE TABLE `products` (
	`product_id` serial AUTO_INCREMENT NOT NULL,
	`product_name` varchar(40) NOT NULL,
	`description` varchar(200),
	CONSTRAINT `products_product_id` PRIMARY KEY(`product_id`)
);
