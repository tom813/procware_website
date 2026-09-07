import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { detectShopifyTheme, parseHtmlForShopifyTheme, cleanDomain } from "./src/server/themeDetector.js";
import { detectShopifyApps, parseHtmlForShopifyApps } from "./src/server/appDetector.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
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
