CREATE TABLE `auth_session` (
	`session_id` varchar(50) NOT NULL,
	`user_id` int NOT NULL,
	`created_at` date NOT NULL,
	CONSTRAINT `auth_session_session_id` PRIMARY KEY(`session_id`)
);
