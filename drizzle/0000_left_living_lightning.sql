CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"competitor_id" text NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"product_urls" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_user_id" text NOT NULL,
	"key" text NOT NULL,
	"filename" text NOT NULL,
	"mime" text NOT NULL,
	"size" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "files_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"phone" text,
	"company" text,
	"monthly_orders" text,
	"source" text DEFAULT 'landing_page',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monitored_stores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"store_id" text NOT NULL,
	"domain" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"category" text DEFAULT 'Shopify Store',
	"image_url" text,
	"currency" text DEFAULT 'EUR',
	"current_price" double precision DEFAULT 0,
	"previous_price" double precision DEFAULT 0,
	"estimated_daily_sales_units" integer DEFAULT 0,
	"estimated_monthly_revenue" double precision DEFAULT 0,
	"sales_velocity" text DEFAULT 'mittel',
	"growth_rate_week_over_week" double precision DEFAULT 0,
	"active_meta_ads" integer DEFAULT 0,
	"product_count" integer DEFAULT 0,
	"theme" text,
	"snapshots" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"last_checked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_watchlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text NOT NULL,
	"domain" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"category" text DEFAULT 'Wettbewerber-Produkt',
	"image_url" text,
	"currency" text DEFAULT 'EUR',
	"current_price" double precision DEFAULT 0,
	"previous_price" double precision DEFAULT 0,
	"price_diff" double precision DEFAULT 0,
	"price_diff_percent" double precision DEFAULT 0,
	"email_alerts_enabled" boolean DEFAULT true,
	"alert_threshold_percent" integer DEFAULT 5,
	"snapshots" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"last_checked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitored_stores" ADD CONSTRAINT "monitored_stores_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_watchlist" ADD CONSTRAINT "product_watchlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "competitors_user_id_idx" ON "competitors" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "files_owner_user_id_idx" ON "files" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "monitored_stores_user_id_idx" ON "monitored_stores" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "product_watchlist_user_id_idx" ON "product_watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");