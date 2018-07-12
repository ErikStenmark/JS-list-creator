BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS `users` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`first_name`	TEXT NOT NULL,
	`last_name`	TEXT NOT NULL,
	`email`	TEXT NOT NULL UNIQUE,
	`password`	TEXT NOT NULL,
	`username`	TEXT NOT NULL UNIQUE
);
INSERT INTO `users` VALUES (1,'Bob','Demo','bob@demo.test','$2y$10$aqo9WbYuwMTCtlZ.B6mRPuoKK2U4gGsU8h09UkSZOSKakk.hFl9lG','Test123');
CREATE TABLE IF NOT EXISTS `lists` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`name`	TEXT DEFAULT 'unamed',
	`type`	TEXT NOT NULL DEFAULT 'todo',
	`datetime`	DATETIME NOT NULL,
	`userid`	INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS `listitems` (
	`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`listid`	INTEGER NOT NULL,
	`userid`	INTEGER NOT NULL,
	`position`	INTEGER NOT NULL,
	`item`	TEXT NOT NULL,
	`checked`	INTEGER NOT NULL DEFAULT 0
);
COMMIT;
