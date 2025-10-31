CREATE TABLE `categories` (
	`name` text PRIMARY KEY NOT NULL,
	CONSTRAINT "categories_name_not_empty" CHECK(length(trim("categories"."name")) >= 1)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`category_name` text NOT NULL,
	FOREIGN KEY (`category_name`) REFERENCES `categories`(`name`) ON UPDATE cascade ON DELETE cascade,
	CONSTRAINT "products_id_not_empty" CHECK(length(trim("products"."id")) >= 1),
	CONSTRAINT "products_name_not_empty" CHECK(length(trim("products"."name")) >= 1),
	CONSTRAINT "products_category_name_not_empty" CHECK(length(trim("products"."category_name")) >= 1),
	CONSTRAINT "products_price_non_negative" CHECK("products"."price" >= 0)
);
