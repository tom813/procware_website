import { pgTable, serial, text, timestamp, doublePrecision, integer, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { user } from "./authSchema.ts";

export { user, session, account, verification } from "./authSchema.ts";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  company: text("company"),
  monthlyOrders: text("monthly_orders"),
  source: text("source").default("landing_page"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const monitoredStores = pgTable(
  "monitored_stores",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    storeId: text("store_id").notNull(),
    domain: text("domain").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    category: text("category").default("Shopify Store"),
    imageUrl: text("image_url"),
    currency: text("currency").default("EUR"),
    currentPrice: doublePrecision("current_price").default(0),
    previousPrice: doublePrecision("previous_price").default(0),
    estimatedDailySalesUnits: integer("estimated_daily_sales_units").default(0),
    estimatedMonthlyRevenue: doublePrecision("estimated_monthly_revenue").default(0),
    salesVelocity: text("sales_velocity").default("mittel"),
    growthRateWeekOverWeek: doublePrecision("growth_rate_week_over_week").default(0),
    activeMetaAds: integer("active_meta_ads").default(0),
    productCount: integer("product_count").default(0),
    theme: text("theme"),
    snapshots: jsonb("snapshots").default([]),
    createdAt: timestamp("created_at").defaultNow(),
    lastCheckedAt: timestamp("last_checked_at").defaultNow(),
  },
  (table) => [index("monitored_stores_user_id_idx").on(table.userId)]
);

export const productWatchlist = pgTable(
  "product_watchlist",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull(),
    domain: text("domain").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    category: text("category").default("Wettbewerber-Produkt"),
    imageUrl: text("image_url"),
    currency: text("currency").default("EUR"),
    currentPrice: doublePrecision("current_price").default(0),
    previousPrice: doublePrecision("previous_price").default(0),
    priceDiff: doublePrecision("price_diff").default(0),
    priceDiffPercent: doublePrecision("price_diff_percent").default(0),
    emailAlertsEnabled: boolean("email_alerts_enabled").default(true),
    alertThresholdPercent: integer("alert_threshold_percent").default(5),
    snapshots: jsonb("snapshots").default([]),
    createdAt: timestamp("created_at").defaultNow(),
    lastCheckedAt: timestamp("last_checked_at").defaultNow(),
  },
  (table) => [index("product_watchlist_user_id_idx").on(table.userId)]
);

export const competitors = pgTable(
  "competitors",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    competitorId: text("competitor_id").notNull(),
    name: text("name").notNull(),
    domain: text("domain").notNull(),
    productUrls: jsonb("product_urls").default([]),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [index("competitors_user_id_idx").on(table.userId)]
);

// FILE-02: every uploaded object has a DB record; the client references files
// by this id, never by raw storage key. Access is authorized against ownerUserId.
export const files = pgTable(
  "files",
  {
    id: text("id").primaryKey(), // crypto.randomUUID()
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    key: text("key").notNull().unique(),
    filename: text("filename").notNull(),
    mime: text("mime").notNull(),
    size: integer("size").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("files_owner_user_id_idx").on(table.ownerUserId)]
);
