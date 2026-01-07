CREATE TABLE `allowances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`person` text NOT NULL,
	`monthlyLimit` integer
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`monthlyBudget` integer
);
