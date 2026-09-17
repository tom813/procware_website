import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { detectShopifyTheme, parseHtmlForShopifyTheme, cleanDomain } from "./src/server/themeDetector.js";
import { detectShopifyApps, parseHtmlForShopifyApps } from "./src/server/appDetector.js";
import { crawlShopifyStore, crawlProductPrice } from "./src/server/intelligenceCrawler.js";

import {
  upsertUser,
  saveLead,
  getLeadsList,
  getStoresForUser,
  saveStoreForUser,
  deleteStoreForUser,
  getProductWatchlistForUser,
  saveProductForUser,
  deleteProductForUser,
  getCompetitorsForUser,
  saveCompetitorForUser,
  deleteCompetitorForUser,
} from "./src/db/queries.ts";
import { pool } from "./src/db/index.ts";
import {
  checkS3Connection,
  uploadFileToS3,
  getFileFromS3,
  deleteFileFromS3,
  listFilesFromS3,
} from "./src/server/s3Storage.ts";

// In-memory persistent lead store (fallback)
interface StoredLead {
  id: string;
  name: string;
  email: string;
  shopUrl?: string;
  source: string;
  createdAt: string;
}

const capturedLeads: StoredLead[] = [
  {
    id: "lead-initial-1",
    name: "Max E-Commerce",
    email: "demo@shopify-store.de",
    shopUrl: "snocks.com",
    source: "Ecom Suite Registration",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Auth configuration endpoint (public client-id for Google OAuth)
  app.get("/api/auth/config", (_req, res) => {
    res.json({
      googleClientId:
        process.env.VITE_GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_CLIENT_ID ||
        "946561379004-bse6a225v7l549fudfnfjsvqefuuqgav.apps.googleusercontent.com",
    });
  });

  // Shopify Theme Detector API
  app.all("/api/detect-theme", async (req, res) => {
    try {
      const targetUrl = (req.method === "POST" ? req.body?.url : req.query?.url) as string | undefined;
      const rawHtml = req.body?.html as string | undefined;

      // If raw HTML is provided directly:
      if (rawHtml && typeof rawHtml === "string" && rawHtml.trim().length > 0) {
        const fallbackUrl = targetUrl || "https://shopify-store-input.myshopify.com";
        const { normalizedUrl, hostname } = cleanDomain(fallbackUrl);
        const result = parseHtmlForShopifyTheme(rawHtml, normalizedUrl, hostname);
        return res.json({ success: true, data: result });
      }

      if (!targetUrl || typeof targetUrl !== "string" || targetUrl.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Bitte gib eine gültige Shop-URL an (z. B. https://snocks.com).",
        });
      }

      const result = await detectShopifyTheme(targetUrl);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      console.error("[Theme Detector API Error]:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Fehler bei der Analyse des Shopify Stores.",
      });
    }
  });

  // Shopify App Detector API
  app.all("/api/detect-apps", async (req, res) => {
    try {
      const targetUrl = (req.method === "POST" ? req.body?.url : req.query?.url) as string | undefined;
      const rawHtml = req.body?.html as string | undefined;

      // If raw HTML is provided directly:
      if (rawHtml && typeof rawHtml === "string" && rawHtml.trim().length > 0) {
        const fallbackUrl = targetUrl || "https://shopify-store-input.myshopify.com";
        const { normalizedUrl, hostname } = cleanDomain(fallbackUrl);
        const result = parseHtmlForShopifyApps(rawHtml, normalizedUrl, hostname);
        return res.json({ success: true, data: result });
      }

      if (!targetUrl || typeof targetUrl !== "string" || targetUrl.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Bitte gib eine gültige Shop-URL an (z. B. https://snocks.com).",
        });
      }

      const result = await detectShopifyApps(targetUrl);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      console.error("[App Detector API Error]:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Fehler bei der App-Analyse des Shopify Stores.",
      });
    }
  });

  // Shopify Intelligence Suite: Crawl store & compute snapshot metrics
  app.post("/api/intelligence/crawl-store", async (req, res) => {
    try {
      const targetUrl = req.body?.url as string | undefined;
      if (!targetUrl || typeof targetUrl !== "string" || targetUrl.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Bitte gib eine gültige Shopify Store-URL an (z. B. https://snocks.com).",
        });
      }

      const result = await crawlShopifyStore(targetUrl);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      console.error("[Intelligence Crawl Error]:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Fehler beim Abruf der Store-Daten.",
      });
    }
  });

  // Competitor Price Tracker: Auto-crawl price and product title
  app.post("/api/intelligence/fetch-product-price", async (req, res) => {
    try {
      const url = req.body?.url as string | undefined;
      if (!url || typeof url !== "string" || url.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Bitte gib eine gültige Produkt-URL an.",
        });
      }

      const result = await crawlProductPrice(url);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      console.error("[Product Price Fetch Error]:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Fehler beim automatischen Preisabruf.",
      });
    }
  });

  // Lead Collection Endpoint: Stores leads in Cloud SQL with in-memory fallback
  app.post("/api/leads", async (req, res) => {
    try {
      const { name, email, shopUrl, source } = req.body || {};
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ success: false, error: "Ungültige E-Mail-Adresse." });
      }

      const cleanEmail = email.trim().toLowerCase();
      const leadPayload = {
        name: name?.trim() || "Unbenannter Händler",
        email: cleanEmail,
        company: shopUrl?.trim() || undefined,
        source: source || "Procware Ecom Suite",
      };

      // Persist in Cloud SQL PostgreSQL
      try {
        const saved = await saveLead(leadPayload);
        console.log(`[Cloud SQL] Lead saved to database: ${cleanEmail}`);
        return res.json({ success: true, message: "Lead erfolgreich in Cloud SQL gespeichert", lead: saved });
      } catch (dbErr) {
        console.warn("[Cloud SQL Fallback] Lead saving to DB failed, using memory:", dbErr);
        const newLead: StoredLead = {
          id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          name: leadPayload.name,
          email: cleanEmail,
          shopUrl: shopUrl?.trim() || "",
          source: leadPayload.source,
          createdAt: new Date().toISOString(),
        };
        capturedLeads.unshift(newLead);
        return res.json({ success: true, message: "Lead temporär gespeichert", lead: newLead });
      }
    } catch (error: any) {
      console.error("[Lead Capture Error]:", error);
      return res.status(500).json({ success: false, error: "Fehler beim Speichern des Leads." });
    }
  });

  app.get("/api/leads", async (_req, res) => {
    try {
      const dbLeads = await getLeadsList();
      return res.json({ success: true, count: dbLeads.length, leads: dbLeads });
    } catch {
      return res.json({ success: true, count: capturedLeads.length, leads: capturedLeads });
    }
  });

  // User Profile Cloud SQL Sync
  app.post("/api/sync/user", async (req, res) => {
    try {
      const { uid, email, name, avatar } = req.body || {};
      if (!uid || !email) {
        return res.status(400).json({ success: false, error: "Missing uid or email." });
      }
      const user = await upsertUser(uid, email, name, avatar);
      return res.json({ success: true, user });
    } catch (error: any) {
      console.error("[Sync User Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to sync user." });
    }
  });

  // Monitored Stores Cloud SQL Endpoints
  app.get("/api/sync/stores", async (req, res) => {
    try {
      const userId = (req.query.userId as string)?.trim().toLowerCase();
      if (!userId) {
        return res.status(400).json({ success: false, error: "Missing userId." });
      }
      const stores = await getStoresForUser(userId);
      return res.json({ success: true, stores });
    } catch (error: any) {
      console.error("[Get Stores Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to fetch stores." });
    }
  });

  app.post("/api/sync/stores", async (req, res) => {
    try {
      const { userId, store } = req.body || {};
      if (!userId || !store || !store.domain) {
        return res.status(400).json({ success: false, error: "Missing userId or store.domain." });
      }
      const saved = await saveStoreForUser(userId.trim().toLowerCase(), store);
      return res.json({ success: true, store: saved });
    } catch (error: any) {
      console.error("[Save Store Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to save store." });
    }
  });

  app.delete("/api/sync/stores", async (req, res) => {
    try {
      const userId = (req.query.userId as string || req.body?.userId)?.trim().toLowerCase();
      const domainOrId = (req.query.domain as string || req.body?.domain || req.query.id as string || req.body?.id);
      if (!userId || !domainOrId) {
        return res.status(400).json({ success: false, error: "Missing userId or domain/id." });
      }
      await deleteStoreForUser(userId, domainOrId);
      return res.json({ success: true });
    } catch (error: any) {
      console.error("[Delete Store Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to delete store." });
    }
  });

  // Product Watchlist Cloud SQL Endpoints
  app.get("/api/sync/watchlist", async (req, res) => {
    try {
      const userId = (req.query.userId as string)?.trim().toLowerCase();
      if (!userId) {
        return res.status(400).json({ success: false, error: "Missing userId." });
      }
      const items = await getProductWatchlistForUser(userId);
      return res.json({ success: true, items });
    } catch (error: any) {
      console.error("[Get Watchlist Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to fetch watchlist." });
    }
  });

  app.post("/api/sync/watchlist", async (req, res) => {
    try {
      const { userId, product } = req.body || {};
      if (!userId || !product || !product.url) {
        return res.status(400).json({ success: false, error: "Missing userId or product.url." });
      }
      const saved = await saveProductForUser(userId.trim().toLowerCase(), product);
      return res.json({ success: true, product: saved });
    } catch (error: any) {
      console.error("[Save Watchlist Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to save product." });
    }
  });

  app.delete("/api/sync/watchlist", async (req, res) => {
    try {
      const userId = (req.query.userId as string || req.body?.userId)?.trim().toLowerCase();
      const productIdOrUrl = (req.query.url as string || req.body?.url || req.query.id as string || req.body?.id);
      if (!userId || !productIdOrUrl) {
        return res.status(400).json({ success: false, error: "Missing userId or url/id." });
      }
      await deleteProductForUser(userId, productIdOrUrl);
      return res.json({ success: true });
    } catch (error: any) {
      console.error("[Delete Watchlist Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to delete product." });
    }
  });

  // Competitors Cloud SQL Endpoints
  app.get("/api/sync/competitors", async (req, res) => {
    try {
      const userId = (req.query.userId as string)?.trim().toLowerCase();
      if (!userId) {
        return res.status(400).json({ success: false, error: "Missing userId." });
      }
      const list = await getCompetitorsForUser(userId);
      return res.json({ success: true, competitors: list });
    } catch (error: any) {
      console.error("[Get Competitors Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to fetch competitors." });
    }
  });

  app.post("/api/sync/competitors", async (req, res) => {
    try {
      const { userId, competitor } = req.body || {};
      if (!userId || !competitor || !competitor.domain) {
        return res.status(400).json({ success: false, error: "Missing userId or competitor.domain." });
      }
      const saved = await saveCompetitorForUser(userId.trim().toLowerCase(), competitor);
      return res.json({ success: true, competitor: saved });
    } catch (error: any) {
      console.error("[Save Competitor Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to save competitor." });
    }
  });

  app.delete("/api/sync/competitors", async (req, res) => {
    try {
      const userId = (req.query.userId as string || req.body?.userId)?.trim().toLowerCase();
      const competitorId = (req.query.id as string || req.body?.id);
      if (!userId || !competitorId) {
        return res.status(400).json({ success: false, error: "Missing userId or id." });
      }
      await deleteCompetitorForUser(userId, competitorId);
      return res.json({ success: true });
    } catch (error: any) {
      console.error("[Delete Competitor Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to delete competitor." });
    }
  });

  // -------------------------------------------------------------
  // Diagnostic & Health Endpoints (PostgreSQL + Garage S3)
  // -------------------------------------------------------------
  app.get("/api/health/status", async (_req, res) => {
    let dbStatus: any = { connected: false };
    try {
      const dbRes = await pool.query(
        "SELECT NOW() as now, current_database() as database, current_user as user;"
      );
      dbStatus = {
        connected: true,
        database: dbRes.rows[0]?.database,
        user: dbRes.rows[0]?.user,
        serverTime: dbRes.rows[0]?.now,
      };
    } catch (e: any) {
      dbStatus = {
        connected: false,
        error: e.message || String(e),
      };
    }

    const s3Status = await checkS3Connection();

    return res.json({
      status: dbStatus.connected ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      storage: s3Status,
    });
  });

  app.get("/api/health/db", async (_req, res) => {
    try {
      const dbRes = await pool.query(
        "SELECT NOW() as now, current_database() as database, current_user as user, version() as version;"
      );
      return res.json({
        success: true,
        connected: true,
        database: dbRes.rows[0]?.database,
        user: dbRes.rows[0]?.user,
        timestamp: dbRes.rows[0]?.now,
        version: dbRes.rows[0]?.version,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        connected: false,
        error: error.message || String(error),
      });
    }
  });

  app.get("/api/health/storage", async (_req, res) => {
    const s3Status = await checkS3Connection();
    return res.json(s3Status);
  });

  // -------------------------------------------------------------
  // Garage S3 Storage Endpoints
  // -------------------------------------------------------------
  // Upload a file to Garage S3
  app.post("/api/files/upload", async (req, res) => {
    try {
      const { filename, contentBase64, contentType, prefix } = req.body || {};
      if (!filename || !contentBase64) {
        return res.status(400).json({
          success: false,
          error: "Missing filename or contentBase64 payload.",
        });
      }

      const buffer = Buffer.from(contentBase64, "base64");
      const safePrefix = (prefix || "uploads").replace(/^\/+|\/+$/g, "");
      const cleanFilename = String(filename).replace(/[^a-zA-Z0-9_.-]/g, "_");
      const timestamp = Date.now();
      const key = `${safePrefix}/${timestamp}-${cleanFilename}`;

      const uploadResult = await uploadFileToS3({
        key,
        buffer,
        contentType: contentType || "application/octet-stream",
      });

      return res.json({
        success: true,
        file: {
          key: uploadResult.key,
          url: uploadResult.url,
          proxyUrl: `/api/files/${uploadResult.key}`,
          size: uploadResult.size,
          contentType: contentType || "application/octet-stream",
        },
      });
    } catch (error: any) {
      console.error("[S3 Upload Error]:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to upload file to S3.",
      });
    }
  });

  // List files in Garage S3
  app.get("/api/files", async (req, res) => {
    try {
      const prefix = (req.query.prefix as string) || "";
      const files = await listFilesFromS3(prefix);
      return res.json({ success: true, count: files.length, files });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to list files.",
      });
    }
  });

  // Download / Stream a file from Garage S3
  app.get("/api/files/*", async (req, res) => {
    try {
      const fileKey = (req.params as any)[0];
      if (!fileKey) {
        return res.status(400).json({ success: false, error: "File key required" });
      }

      const file = await getFileFromS3(fileKey);
      if (!file) {
        return res.status(404).json({ success: false, error: "File not found in S3 bucket" });
      }

      res.setHeader("Content-Type", file.contentType);
      if (file.contentLength) {
        res.setHeader("Content-Length", file.contentLength);
      }
      return res.send(file.buffer);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch file from S3.",
      });
    }
  });

  // Delete a file from Garage S3
  app.delete("/api/files/*", async (req, res) => {
    try {
      const fileKey = (req.params as any)[0];
      if (!fileKey) {
        return res.status(400).json({ success: false, error: "File key required" });
      }
      const success = await deleteFileFromS3(fileKey);
      return res.json({ success });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to delete file.",
      });
    }
  });

  // Legacy WordPress upload fallback mapping to prevent broken image HTML returns
  app.get("/wp-content/uploads/*", (req, res) => {
    const p = req.path.toLowerCase();
    if (p.includes("rundgang")) {
      return res.redirect(301, "/images/sourcing-rfq.jpg");
    }
    if (p.includes("chat")) {
      return res.redirect(301, "/images/sourcing-chat.jpg");
    }
    if (p.includes("shopify-app") || p.includes("shopify")) {
      return res.redirect(301, "/images/fulfillment-dashboard.jpg");
    }
    if (p.includes("map")) {
      return res.redirect(301, "/images/fulfillment-dashboard.jpg");
    }
    return res.status(404).send("Image not found");
  });

  // Static asset serving & S3 fallback for images & flags
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath));

  // Fallback for image and flag assets from S3 if missing on local disk
  app.get(["/images/*", "/flags/*", "/procware-logo-wide.png"], async (req, res, next) => {
    const key = req.path.replace(/^\/+/, "");
    try {
      const file = await getFileFromS3(key);
      if (file) {
        res.setHeader("Content-Type", file.contentType);
        if (file.contentLength) {
          res.setHeader("Content-Length", file.contentLength);
        }
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(file.buffer);
      }
    } catch {
      // Continue to next handler
    }
    return res.status(404).send("Image not found");
  });

  // Vite middleware for development vs static production serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
