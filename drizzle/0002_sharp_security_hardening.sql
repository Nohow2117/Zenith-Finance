PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `accounts__new` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`balance_eur` real DEFAULT 0 NOT NULL,
	`card_last_four` text,
	`card_expiry` text,
	`card_network` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `accounts__new` (`id`, `name`, `balance_eur`, `card_last_four`, `card_expiry`, `card_network`, `is_active`, `created_at`)
SELECT
	`id`,
	`name`,
	`balance_eur`,
	CASE
		WHEN `card_number` IS NULL OR trim(`card_number`) = '' THEN NULL
		ELSE substr(replace(`card_number`, ' ', ''), -4)
	END,
	`card_expiry`,
	`card_network`,
	`is_active`,
	`created_at`
FROM `accounts`;
--> statement-breakpoint
DROP TABLE `accounts`;
--> statement-breakpoint
ALTER TABLE `accounts__new` RENAME TO `accounts`;
--> statement-breakpoint
CREATE TABLE `login_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_type` text NOT NULL,
	`username` text NOT NULL,
	`ip_address` text NOT NULL,
	`attempt_count` integer DEFAULT 0 NOT NULL,
	`window_started_at` text NOT NULL,
	`last_attempt_at` text NOT NULL,
	`locked_until` text,
	`lock_level` integer DEFAULT 0 NOT NULL,
	`last_locked_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `login_attempts_actor_username_ip_idx` ON `login_attempts` (`actor_type`, `username`, `ip_address`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
