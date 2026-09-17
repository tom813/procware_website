import { db } from "./index.ts";
import { users, leads, monitoredStores, productWatchlist, competitors } from "./schema.ts";
import { eq, and } from "drizzle-orm";

export async function upsertUser(uid: string, email: string, name?: string, avatar?: string) {
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
    console.error("Database upsertUser failed:", error);
    throw new Error("Failed to synchronize user profile with database.", { cause: error });
  }
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
    console.error("Database saveLead failed:", error);
    throw new Error("Failed to save lead in database.", { cause: error });
  }
}

export async function getLeadsList() {
  try {
    return await db.select().from(leads);
  } catch (error) {
    console.error("Database getLeadsList failed:", error);
    throw new Error("Failed to fetch leads from database.", { cause: error });
  }
}

export async function getStoresForUser(userId: string) {
  try {
    return await db.select().from(monitoredStores).where(eq(monitoredStores.userId, userId));
  } catch (error) {
    console.error("Database getStoresForUser failed:", error);
    throw new Error("Failed to fetch monitored stores.", { cause: error });
  }
}

export async function saveStoreForUser(userId: string, storeData: any) {
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
    console.error("Database saveStoreForUser failed:", error);
    throw new Error("Failed to save store in database.", { cause: error });
  }
}

export async function deleteStoreForUser(userId: string, domainOrId: string) {
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
    console.error("Database deleteStoreForUser failed:", error);
    throw new Error("Failed to delete store from database.", { cause: error });
  }
}

export async function getProductWatchlistForUser(userId: string) {
  try {
    return await db.select().from(productWatchlist).where(eq(productWatchlist.userId, userId));
  } catch (error) {
    console.error("Database getProductWatchlistForUser failed:", error);
    throw new Error("Failed to fetch product watchlist.", { cause: error });
  }
}

export async function saveProductForUser(userId: string, prod: any) {
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
    console.error("Database saveProductForUser failed:", error);
    throw new Error("Failed to save product in database.", { cause: error });
  }
}

export async function deleteProductForUser(userId: string, productIdOrUrl: string) {
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
    console.error("Database deleteProductForUser failed:", error);
    throw new Error("Failed to delete product from database.", { cause: error });
  }
}

export async function getCompetitorsForUser(userId: string) {
  try {
    return await db.select().from(competitors).where(eq(competitors.userId, userId));
  } catch (error) {
    console.error("Database getCompetitorsForUser failed:", error);
    throw new Error("Failed to fetch competitors.", { cause: error });
  }
}

export async function saveCompetitorForUser(userId: string, comp: any) {
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
    console.error("Database saveCompetitorForUser failed:", error);
    throw new Error("Failed to save competitor in database.", { cause: error });
  }
}

export async function deleteCompetitorForUser(userId: string, competitorId: string) {
  try {
    await db
      .delete(competitors)
      .where(and(eq(competitors.userId, userId), eq(competitors.competitorId, competitorId)));
    return { success: true };
  } catch (error) {
    console.error("Database deleteCompetitorForUser failed:", error);
    throw new Error("Failed to delete competitor from database.", { cause: error });
  }
}
