import { db } from "./index.ts";
import { users, leads, monitoredStores, productWatchlist, competitors } from "./schema.ts";
import { eq, and } from "drizzle-orm";

// In-memory fallback stores (used when DB is unreachable or not yet configured)
const memUsers = new Map<string, any>();
const memLeads: any[] = [];
const memStores = new Map<string, any[]>();
const memWatchlist = new Map<string, any[]>();
const memCompetitors = new Map<string, any[]>();

const isDbReady = () => Boolean(process.env.DATABASE_URL || process.env.SQL_HOST);

export async function upsertUser(uid: string, email: string, name?: string, avatar?: string) {
  if (isDbReady()) {
    try {
      const result = await db
        .insert(users)
        .values({
          uid,
          email,
          name: name || null,
          avatar: avatar || null,
          lastLoginAt: new Date(),
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            ...(name ? { name } : {}),
            ...(avatar ? { avatar } : {}),
            lastLoginAt: new Date(),
          },
        })
        .returning();

      return result[0];
    } catch (error) {
      console.warn("Database upsertUser failed, using in-memory fallback:", error);
    }
  }

  const existing = memUsers.get(uid) || { uid, createdAt: new Date() };
  const updated = {
    ...existing,
    email,
    name: name || existing.name || null,
    avatar: avatar || existing.avatar || null,
    lastLoginAt: new Date(),
  };
  memUsers.set(uid, updated);
  return updated;
}

export async function saveLead(data: {
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  monthlyOrders?: string;
  source?: string;
  notes?: string;
}) {
  if (isDbReady()) {
    try {
      const result = await db
        .insert(leads)
        .values({
          email: data.email,
          name: data.name || null,
          phone: data.phone || null,
          company: data.company || null,
          monthlyOrders: data.monthlyOrders || null,
          source: data.source || "landing_page",
          notes: data.notes || null,
        })
        .returning();
      return result[0];
    } catch (error) {
      console.warn("Database saveLead failed, using in-memory fallback:", error);
    }
  }

  const newLead = {
    id: memLeads.length + 1,
    email: data.email,
    name: data.name || null,
    phone: data.phone || null,
    company: data.company || null,
    monthlyOrders: data.monthlyOrders || null,
    source: data.source || "landing_page",
    notes: data.notes || null,
    createdAt: new Date(),
  };
  memLeads.unshift(newLead);
  return newLead;
}

export async function getLeadsList() {
  if (isDbReady()) {
    try {
      return await db.select().from(leads);
    } catch (error) {
      console.warn("Database getLeadsList failed, using in-memory fallback:", error);
    }
  }
  return memLeads;
}

export async function getStoresForUser(userId: string) {
  if (isDbReady()) {
    try {
      return await db.select().from(monitoredStores).where(eq(monitoredStores.userId, userId));
    } catch (error) {
      console.warn("Database getStoresForUser failed, using in-memory fallback:", error);
    }
  }
  return memStores.get(userId) || [];
}

export async function saveStoreForUser(userId: string, storeData: any) {
  if (isDbReady()) {
    try {
      // Delete existing entry if present for this domain or storeId to update cleanly
      await db
        .delete(monitoredStores)
        .where(and(eq(monitoredStores.userId, userId), eq(monitoredStores.domain, storeData.domain)));

      const result = await db
        .insert(monitoredStores)
        .values({
          userId,
          storeId: storeData.id || `item-${storeData.domain.replace(/\./g, "-")}`,
          domain: storeData.domain,
          title: storeData.title || storeData.name || storeData.domain,
          url: storeData.url || `https://${storeData.domain}`,
          category: storeData.category || "Shopify Store",
          imageUrl: storeData.imageUrl || null,
          currency: storeData.currency || "EUR",
          currentPrice: storeData.currentPrice || 0,
          previousPrice: storeData.previousPrice || 0,
          estimatedDailySalesUnits: storeData.estimatedDailySalesUnits || 0,
          estimatedMonthlyRevenue: storeData.estimatedMonthlyRevenue || 0,
          salesVelocity: storeData.salesVelocity || "mittel",
          growthRateWeekOverWeek: storeData.growthRateWeekOverWeek || 0,
          activeMetaAds: storeData.activeMetaAds || 0,
          productCount: storeData.productCount || 0,
          theme: storeData.theme || null,
          snapshots: storeData.snapshots || [],
          lastCheckedAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.warn("Database saveStoreForUser failed, using in-memory fallback:", error);
    }
  }

  const userStores = memStores.get(userId) || [];
  const cleanStores = userStores.filter((s) => s.domain !== storeData.domain);
  const newStore = {
    userId,
    storeId: storeData.id || `item-${storeData.domain.replace(/\./g, "-")}`,
    domain: storeData.domain,
    title: storeData.title || storeData.name || storeData.domain,
    url: storeData.url || `https://${storeData.domain}`,
    category: storeData.category || "Shopify Store",
    imageUrl: storeData.imageUrl || null,
    currency: storeData.currency || "EUR",
    currentPrice: storeData.currentPrice || 0,
    previousPrice: storeData.previousPrice || 0,
    estimatedDailySalesUnits: storeData.estimatedDailySalesUnits || 0,
    estimatedMonthlyRevenue: storeData.estimatedMonthlyRevenue || 0,
    salesVelocity: storeData.salesVelocity || "mittel",
    growthRateWeekOverWeek: storeData.growthRateWeekOverWeek || 0,
    activeMetaAds: storeData.activeMetaAds || 0,
    productCount: storeData.productCount || 0,
    theme: storeData.theme || null,
    snapshots: storeData.snapshots || [],
    lastCheckedAt: new Date(),
  };
  cleanStores.unshift(newStore);
  memStores.set(userId, cleanStores);
  return newStore;
}

export async function deleteStoreForUser(userId: string, domainOrId: string) {
  if (isDbReady()) {
    try {
      await db
        .delete(monitoredStores)
        .where(
          and(
            eq(monitoredStores.userId, userId),
            domainOrId.includes(".")
              ? eq(monitoredStores.domain, domainOrId)
              : eq(monitoredStores.storeId, domainOrId)
          )
        );
      return { success: true };
    } catch (error) {
      console.warn("Database deleteStoreForUser failed, using in-memory fallback:", error);
    }
  }

  const userStores = memStores.get(userId) || [];
  memStores.set(
    userId,
    userStores.filter((s) => s.domain !== domainOrId && s.storeId !== domainOrId)
  );
  return { success: true };
}

export async function getProductWatchlistForUser(userId: string) {
  if (isDbReady()) {
    try {
      return await db.select().from(productWatchlist).where(eq(productWatchlist.userId, userId));
    } catch (error) {
      console.warn("Database getProductWatchlistForUser failed, using in-memory fallback:", error);
    }
  }
  return memWatchlist.get(userId) || [];
}

export async function saveProductForUser(userId: string, prod: any) {
  if (isDbReady()) {
    try {
      await db
        .delete(productWatchlist)
        .where(and(eq(productWatchlist.userId, userId), eq(productWatchlist.url, prod.url)));

      const result = await db
        .insert(productWatchlist)
        .values({
          userId,
          productId: prod.id || `prod-${Date.now()}`,
          domain: prod.domain,
          title: prod.title,
          url: prod.url,
          category: prod.category || "Wettbewerber-Produkt",
          imageUrl: prod.imageUrl || null,
          currency: prod.currency || "EUR",
          currentPrice: prod.currentPrice || 0,
          previousPrice: prod.previousPrice || 0,
          priceDiff: prod.priceDiff || 0,
          priceDiffPercent: prod.priceDiffPercent || 0,
          emailAlertsEnabled: prod.emailAlertsEnabled ?? true,
          alertThresholdPercent: prod.alertThresholdPercent || 5,
          snapshots: prod.snapshots || [],
          lastCheckedAt: new Date(),
        })
        .returning();

      return result[0];
    } catch (error) {
      console.warn("Database saveProductForUser failed, using in-memory fallback:", error);
    }
  }

  const userProds = memWatchlist.get(userId) || [];
  const cleanProds = userProds.filter((p) => p.url !== prod.url);
  const newProd = {
    userId,
    productId: prod.id || `prod-${Date.now()}`,
    domain: prod.domain,
    title: prod.title,
    url: prod.url,
    category: prod.category || "Wettbewerber-Produkt",
    imageUrl: prod.imageUrl || null,
    currency: prod.currency || "EUR",
    currentPrice: prod.currentPrice || 0,
    previousPrice: prod.previousPrice || 0,
    priceDiff: prod.priceDiff || 0,
    priceDiffPercent: prod.priceDiffPercent || 0,
    emailAlertsEnabled: prod.emailAlertsEnabled ?? true,
    alertThresholdPercent: prod.alertThresholdPercent || 5,
    snapshots: prod.snapshots || [],
    lastCheckedAt: new Date(),
  };
  cleanProds.unshift(newProd);
  memWatchlist.set(userId, cleanProds);
  return newProd;
}

export async function deleteProductForUser(userId: string, productIdOrUrl: string) {
  if (isDbReady()) {
    try {
      await db
        .delete(productWatchlist)
        .where(
          and(
            eq(productWatchlist.userId, userId),
            productIdOrUrl.startsWith("http")
              ? eq(productWatchlist.url, productIdOrUrl)
              : eq(productWatchlist.productId, productIdOrUrl)
          )
        );
      return { success: true };
    } catch (error) {
      console.warn("Database deleteProductForUser failed, using in-memory fallback:", error);
    }
  }

  const userProds = memWatchlist.get(userId) || [];
  memWatchlist.set(
    userId,
    userProds.filter((p) => p.url !== productIdOrUrl && p.productId !== productIdOrUrl)
  );
  return { success: true };
}

export async function getCompetitorsForUser(userId: string) {
  if (isDbReady()) {
    try {
      return await db.select().from(competitors).where(eq(competitors.userId, userId));
    } catch (error) {
      console.warn("Database getCompetitorsForUser failed, using in-memory fallback:", error);
    }
  }
  return memCompetitors.get(userId) || [];
}

export async function saveCompetitorForUser(userId: string, comp: any) {
  if (isDbReady()) {
    try {
      await db
        .delete(competitors)
        .where(and(eq(competitors.userId, userId), eq(competitors.domain, comp.domain)));

      const result = await db
        .insert(competitors)
        .values({
          userId,
          competitorId: comp.id || `comp-${Date.now()}`,
          name: comp.name,
          domain: comp.domain,
          productUrls: comp.productUrls || [],
          notes: comp.notes || null,
        })
        .returning();

      return result[0];
    } catch (error) {
      console.warn("Database saveCompetitorForUser failed, using in-memory fallback:", error);
    }
  }

  const userComps = memCompetitors.get(userId) || [];
  const cleanComps = userComps.filter((c) => c.domain !== comp.domain);
  const newComp = {
    userId,
    competitorId: comp.id || `comp-${Date.now()}`,
    name: comp.name,
    domain: comp.domain,
    productUrls: comp.productUrls || [],
    notes: comp.notes || null,
    createdAt: new Date(),
  };
  cleanComps.unshift(newComp);
  memCompetitors.set(userId, cleanComps);
  return newComp;
}

export async function deleteCompetitorForUser(userId: string, competitorId: string) {
  if (isDbReady()) {
    try {
      await db
        .delete(competitors)
        .where(and(eq(competitors.userId, userId), eq(competitors.competitorId, competitorId)));
      return { success: true };
    } catch (error) {
      console.warn("Database deleteCompetitorForUser failed, using in-memory fallback:", error);
    }
  }

  const userComps = memCompetitors.get(userId) || [];
  memCompetitors.set(
    userId,
    userComps.filter((c) => c.competitorId !== competitorId)
  );
  return { success: true };
}
