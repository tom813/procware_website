import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import { createServer as createViteServer } from "vite";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/lib/auth.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { detectShopifyTheme, parseHtmlForShopifyTheme, cleanDomain } from "./src/server/themeDetector.js";
import { detectShopifyApps, parseHtmlForShopifyApps } from "./src/server/appDetector.js";
import { crawlShopifyStore, crawlProductPrice } from "./src/server/intelligenceCrawler.js";

import {
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
  createFileRecord,
  listFilesForOwner,
  getOwnedFile,
  deleteOwnedFile,
} from "./src/db/fileQueries.ts";
import {
  checkS3Connection,
  uploadFileToS3,
  getFileFromS3,
  deleteFileFromS3,
} from "./src/server/s3Storage.ts";

// In-memory persistent lead store (fallback only for the public lead-capture
// form when the database is unreachable; never used for authenticated reads)
interface StoredLead {
  id: string;
  name: string;
  email: string;
  shopUrl?: string;
  source: string;
  createdAt: string;
}

const capturedLeads: StoredLead[] = [];

// Rate limit for endpoints that trigger outbound server-side fetches to
// user-supplied URLs (AUTH-05 / FILE-04: abuse & cost protection for public tools).
const crawlerRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Zu viele Anfragen. Bitte versuche es in einer Minute erneut." },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mounted before the JSON body parser: better-auth reads and parses the
  // raw request body itself.
  app.all("/api/auth/*", toNodeHandler(auth));

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Shopify Theme Detector API (public lead-gen tool; SSRF-guarded + rate-limited)
  app.all("/api/detect-theme", crawlerRateLimit, async (req, res) => {
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

  // Shopify App Detector API (public lead-gen tool; SSRF-guarded + rate-limited)
  app.all("/api/detect-apps", crawlerRateLimit, async (req, res) => {
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
  // (public lead-gen tool; SSRF-guarded + rate-limited)
  app.post("/api/intelligence/crawl-store", crawlerRateLimit, async (req, res) => {
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
  // (public lead-gen tool; SSRF-guarded + rate-limited)
  app.post("/api/intelligence/fetch-product-price", crawlerRateLimit, async (req, res) => {
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

  // Lead Collection Endpoint (public marketing/booking form): Stores leads in
  // Cloud SQL with in-memory fallback.
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
          id: `lead-${randomUUID()}`,
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

  // Leads list contains PII (name, email) -> requires authentication (API-01, FILE-05).
  app.get("/api/leads", requireAuth, async (_req, res) => {
    try {
      const dbLeads = await getLeadsList();
      return res.json({ success: true, count: dbLeads.length, leads: dbLeads });
    } catch {
      return res.json({ success: true, count: capturedLeads.length, leads: capturedLeads });
    }
  });

  // -------------------------------------------------------------
  // Ecom Suite Sync Endpoints (Cloud SQL) — all scoped to the
  // authenticated session's user id (TEN-01: never from query/body).
  // -------------------------------------------------------------
  app.get("/api/sync/stores", requireAuth, async (req: AuthRequest, res) => {
    try {
      const stores = await getStoresForUser(req.user!.id);
      return res.json({ success: true, stores });
    } catch (error: any) {
      console.error("[Get Stores Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to fetch stores." });
    }
  });

  app.post("/api/sync/stores", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { store } = req.body || {};
      if (!store || !store.domain) {
        return res.status(400).json({ success: false, error: "Missing store.domain." });
      }
      const saved = await saveStoreForUser(req.user!.id, store);
      return res.json({ success: true, store: saved });
    } catch (error: any) {
      console.error("[Save Store Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to save store." });
    }
  });

  app.delete("/api/sync/stores", requireAuth, async (req: AuthRequest, res) => {
    try {
      const domainOrId = (req.query.domain as string) || req.body?.domain || (req.query.id as string) || req.body?.id;
      if (!domainOrId) {
        return res.status(400).json({ success: false, error: "Missing domain/id." });
      }
      await deleteStoreForUser(req.user!.id, domainOrId);
      return res.json({ success: true });
    } catch (error: any) {
      console.error("[Delete Store Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to delete store." });
    }
  });

  app.get("/api/sync/watchlist", requireAuth, async (req: AuthRequest, res) => {
    try {
      const items = await getProductWatchlistForUser(req.user!.id);
      return res.json({ success: true, items });
    } catch (error: any) {
      console.error("[Get Watchlist Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to fetch watchlist." });
    }
  });

  app.post("/api/sync/watchlist", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { product } = req.body || {};
      if (!product || !product.url) {
        return res.status(400).json({ success: false, error: "Missing product.url." });
      }
      const saved = await saveProductForUser(req.user!.id, product);
      return res.json({ success: true, product: saved });
    } catch (error: any) {
      console.error("[Save Watchlist Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to save product." });
    }
  });

  app.delete("/api/sync/watchlist", requireAuth, async (req: AuthRequest, res) => {
    try {
      const productIdOrUrl = (req.query.url as string) || req.body?.url || (req.query.id as string) || req.body?.id;
      if (!productIdOrUrl) {
        return res.status(400).json({ success: false, error: "Missing url/id." });
      }
      await deleteProductForUser(req.user!.id, productIdOrUrl);
      return res.json({ success: true });
    } catch (error: any) {
      console.error("[Delete Watchlist Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to delete product." });
    }
  });

  app.get("/api/sync/competitors", requireAuth, async (req: AuthRequest, res) => {
    try {
      const list = await getCompetitorsForUser(req.user!.id);
      return res.json({ success: true, competitors: list });
    } catch (error: any) {
      console.error("[Get Competitors Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to fetch competitors." });
    }
  });

  app.post("/api/sync/competitors", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { competitor } = req.body || {};
      if (!competitor || !competitor.domain) {
        return res.status(400).json({ success: false, error: "Missing competitor.domain." });
      }
      const saved = await saveCompetitorForUser(req.user!.id, competitor);
      return res.json({ success: true, competitor: saved });
    } catch (error: any) {
      console.error("[Save Competitor Error]:", error);
      return res.status(500).json({ success: false, error: error.message || "Failed to save competitor." });
    }
  });

  app.delete("/api/sync/competitors", requireAuth, async (req: AuthRequest, res) => {
    try {
      const competitorId = (req.query.id as string) || req.body?.id;
      if (!competitorId) {
        return res.status(400).json({ success: false, error: "Missing id." });
      }
      await deleteCompetitorForUser(req.user!.id, competitorId);
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
  // Garage S3 Storage Endpoints (FILE-01..03): every object has a DB
  // record owned by the uploader; clients reference files by DB id, never
  // by raw storage key/prefix.
  // -------------------------------------------------------------
  app.post("/api/files/upload", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { filename, contentBase64, contentType } = req.body || {};
      if (!filename || !contentBase64) {
        return res.status(400).json({
          success: false,
          error: "Missing filename or contentBase64 payload.",
        });
      }

      const buffer = Buffer.from(contentBase64, "base64");
      const cleanFilename = String(filename).replace(/[^a-zA-Z0-9_.-]/g, "_");
      const fileId = randomUUID();
      const key = `org-users/${req.user!.id}/${fileId}-${cleanFilename}`;
      const mime = contentType || "application/octet-stream";

      await uploadFileToS3({ key, buffer, contentType: mime });

      const record = await createFileRecord({
        id: fileId,
        ownerUserId: req.user!.id,
        key,
        filename: cleanFilename,
        mime,
        size: buffer.length,
      });

      return res.json({
        success: true,
        file: {
          id: record.id,
          filename: record.filename,
          size: record.size,
          contentType: record.mime,
          url: `/api/files/${record.id}`,
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

  // List the current user's own files
  app.get("/api/files", requireAuth, async (req: AuthRequest, res) => {
    try {
      const rows = await listFilesForOwner(req.user!.id);
      const files = rows.map((r) => ({
        id: r.id,
        filename: r.filename,
        size: r.size,
        contentType: r.mime,
        createdAt: r.createdAt,
        url: `/api/files/${r.id}`,
      }));
      return res.json({ success: true, count: files.length, files });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to list files.",
      });
    }
  });

  // Download / Stream one of the current user's own files by DB id
  app.get("/api/files/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const record = await getOwnedFile(req.params.id, req.user!.id);
      if (!record) {
        return res.status(404).json({ success: false, error: "File not found" });
      }

      const file = await getFileFromS3(record.key);
      if (!file) {
        return res.status(404).json({ success: false, error: "File not found in S3 bucket" });
      }

      res.setHeader("Content-Type", file.contentType);
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Content-Disposition", `attachment; filename="${record.filename.replace(/"/g, "")}"`);
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

  // Delete one of the current user's own files by DB id
  app.delete("/api/files/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      const record = await getOwnedFile(req.params.id, req.user!.id);
      if (!record) {
        return res.status(404).json({ success: false, error: "File not found" });
      }
      await deleteFileFromS3(record.key);
      await deleteOwnedFile(record.id, req.user!.id);
      return res.json({ success: true });
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
  app.get(["/images/*", "/flags/*", "/procware-logo-wide.png"], async (req, res) => {
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
