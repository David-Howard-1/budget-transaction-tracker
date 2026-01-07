CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`person` text DEFAULT 'Joint' NOT NULL,
	`paymentMethod` text NOT NULL,
	`amount` integer NOT NULL
);
