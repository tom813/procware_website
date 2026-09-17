export interface User {
  id: string;
  name: string;
  email: string;
  shopUrl?: string;
  provider: "email" | "google";
  avatarUrl?: string;
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  shopUrl?: string;
  source: string;
  createdAt: string;
}

export type PlatformSource = "shopify" | "aliexpress" | "meta_ads" | "manual";

export interface SnapshotData {
  id: string;
  timestamp: string; // ISO string
  price: number;
  originalPrice?: number;
  currency: string;
  stockLevel?: number | null; // estimated or reported inventory
  orderCount?: number; // cumulative or period orders
  rating?: number;
  reviewCount?: number;
  activeAdsCount?: number;
  notes?: string;
}

export interface MonitoredItem {
  id: string;
  userId?: string;
  url: string;
  domain: string;
  source: PlatformSource;
  title: string;
  category: string;
  imageUrl: string;
  currency: string;
  createdAt: string;
  lastCheckedAt: string;
  alertThresholdPercent?: number; // e.g. 5% price drop
  snapshots: SnapshotData[];
  
  // Computed metrics from snapshots
  currentPrice: number;
  previousPrice: number;
  priceDiff: number;
  priceDiffPercent: number;
  
  estimatedDailySalesUnits: number;
  estimatedMonthlyRevenue: number;
  salesVelocity: "hoch" | "mittel" | "niedrig";
  
  growthRateWeekOverWeek?: number; // % change 7d vs prev 7d
  activeMetaAds?: number;
  trendPhase?: "breakout" | "growth" | "mature" | "cooling";
  emailAlertsEnabled?: boolean;
  itemType?: "store" | "product";
}

export interface TrendingProductItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  price: number;
  supplierCost: number;
  estimatedMargin: number;
  currency: string;
  sourceUrl: string;
  platform: "aliexpress" | "shopify" | "tiktok";
  ordersLast7d: number;
  ordersPrev7d: number;
  growthRatePercent: number; // calculated: (ordersLast7d - ordersPrev7d) / ordersPrev7d * 100
  totalOrders: number;
  activeMetaAds: number;
  trendPhase: "early_breakout" | "high_growth" | "maturing";
  firstDetectedDate: string;
  snapshots: { date: string; orders: number; price: number }[];
}

export interface ShopifyCrawlResult {
  domain: string;
  title: string;
  currency: string;
  productCount: number;
  products: {
    id: number | string;
    title: string;
    handle: string;
    price: number;
    compareAtPrice: number | null;
    available: boolean;
    variantsCount: number;
    imageUrl?: string;
    publishedAt: string;
    vendor: string;
    productType: string;
  }[];
  estimatedMonthlyRevenue: number;
  estimatedMonthlyUnits: number;
  averagePrice: number;
  lastUpdated: string;
}
