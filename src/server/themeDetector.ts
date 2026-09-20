import * as cheerio from "cheerio";
import {
  ThemeDetectionResult,
  ShopifyThemeInfo,
  DetectedApp,
  SHOPIFY_THEME_CATALOG,
  KNOWN_EXTERNAL_THEMES,
  APP_SIGNATURES,
} from "../data/shopifyThemesData";
import { safeFetch } from "./lib/ssrfGuard.ts";

export function cleanDomain(inputUrl: string): { normalizedUrl: string; hostname: string } {
  let url = inputUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const parsed = new URL(url);
  return {
    normalizedUrl: parsed.href,
    hostname: parsed.hostname.replace(/^www\./, ""),
  };
}

export function detectAlternativePlatform(html: string, headers?: Headers | Record<string, string | string[] | undefined>): string | undefined {
  if (/wp-content\/plugins\/woocommerce|woocommerce-js|woocommerce/i.test(html)) {
    return "WooCommerce (WordPress)";
  }
  if (/wp-content\/|wp-includes\//i.test(html)) {
    return "WordPress";
  }
  if (/Mage\.Cookies|static\/frontend\/|mage\/cookies/i.test(html)) {
    return "Magento / Adobe Commerce";
  }
  if (/shopware|bundles\/storefront/i.test(html)) {
    return "Shopware";
  }
  if (/cdn11\.bigcommerce\.com|bigcommerce/i.test(html)) {
    return "BigCommerce";
  }
  if (/squarespace\.com|static1\.squarespace\.com/i.test(html)) {
    return "Squarespace";
  }
  if (/wix\.com|wixstatic\.com/i.test(html)) {
    return "Wix";
  }
  if (/prestashop/i.test(html)) {
    return "PrestaShop";
  }
  return undefined;
}

export function parseHtmlForShopifyTheme(
  html: string,
  normalizedUrl: string,
  hostname: string,
  responseHeaders?: Headers,
  finalUrl?: string
): ThemeDetectionResult {
  const checkedAt = new Date().toISOString();
  const detectionSignals: string[] = [];
  const $ = cheerio.load(html);
  const resolvedFinalUrl = finalUrl || normalizedUrl;

  // 1. Check if it is a Shopify Store
  let isShopify = false;

  const headerPoweredBy = responseHeaders?.get ? (responseHeaders.get("powered-by") || "") : "";
  const headerShopId = responseHeaders?.get ? (responseHeaders.get("x-shopid") || responseHeaders.get("x-shardid")) : null;
  if (/shopify/i.test(headerPoweredBy) || headerShopId) {
    isShopify = true;
    detectionSignals.push("Shopify HTTP Response Header identifiziert (X-ShopId / Powered-By)");
  }

  if (/cdn\.shopify\.com/i.test(html)) {
    isShopify = true;
    detectionSignals.push("Shopify CDN (cdn.shopify.com) in HTML-Ressourcen gefunden");
  }

  if (/window\.Shopify\s*=|Shopify\.theme\s*=|ShopifyAnalytics/i.test(html)) {
    isShopify = true;
    detectionSignals.push("Shopify JavaScript Core Objekt (window.Shopify) vorhanden");
  }

  if ($('meta[name="shopify-checkout-api-token"], meta[id="shopify-digital-wallet"]').length > 0) {
    isShopify = true;
    detectionSignals.push("Shopify Checkout & Wallet Meta-Tags nachgewiesen");
  }

  if (/myshopify\.com/i.test(html)) {
    isShopify = true;
    detectionSignals.push("Shopify myShopify Domain-Referenz erkannt");
  }

  // If not Shopify, detect alternative platform
  if (!isShopify) {
    const alternative = detectAlternativePlatform(html, responseHeaders);
    return {
      url: normalizedUrl,
      finalUrl: resolvedFinalUrl,
      domain: hostname,
      isShopify: false,
      alternativePlatform: alternative || "Anderes CMS / E-Commerce System (Kein Shopify)",
      storeName: $("title").text().trim() || hostname,
      storeFavicon: $('link[rel="icon"], link[rel="shortcut icon"]').attr("href"),
      ogImage: $('meta[property="og:image"]').attr("content"),
      description: $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content"),
      theme: null,
      detectedApps: [],
      checkedAt,
      detectionSignals: ["Keine Shopify-Merkmale im Quelltext oder in den Responsen gefunden"],
    };
  }

  // 2. Extract Shopify Theme Data
  let rawThemeName = "";
  let themeStoreId: number | null = null;
  let themeId: string | number | undefined = undefined;
  let themeRole: string | undefined = undefined;
  let themeVersion: string | undefined = undefined;

  // Pattern A: Shopify.theme = {"name":"...","id":...,"theme_store_id":...,"role":"..."};
  const shopifyThemeRegex = /Shopify\.theme\s*=\s*({[\s\S]*?});/i;
  const matchShopifyTheme = html.match(shopifyThemeRegex);
  if (matchShopifyTheme && matchShopifyTheme[1]) {
    try {
      const parsedTheme = JSON.parse(matchShopifyTheme[1]);
      if (parsedTheme.name) rawThemeName = String(parsedTheme.name).trim();
      if (parsedTheme.theme_store_id !== undefined && parsedTheme.theme_store_id !== null) {
        const numId = Number(parsedTheme.theme_store_id);
        if (!isNaN(numId) && numId > 0) themeStoreId = numId;
      }
      if (parsedTheme.id) themeId = parsedTheme.id;
      if (parsedTheme.role) themeRole = parsedTheme.role;
      detectionSignals.push(`Shopify.theme Objekt erfolgreich extrahiert: "${rawThemeName}"`);
    } catch {
      // JSON parse fallback with regex
      const nameMatch = matchShopifyTheme[1].match(/"name"\s*:\s*"([^"]+)"/);
      if (nameMatch) rawThemeName = nameMatch[1];
      const storeIdMatch = matchShopifyTheme[1].match(/"theme_store_id"\s*:\s*([0-9]+)/);
      if (storeIdMatch) themeStoreId = Number(storeIdMatch[1]);
      const idMatch = matchShopifyTheme[1].match(/"id"\s*:\s*([0-9]+)/);
      if (idMatch) themeId = idMatch[1];
    }
  }

  // Pattern B: BOOMR.themeName / BOOMR.themeVersion
  const boomrThemeMatch = html.match(/BOOMR\.themeName\s*=\s*["']([^"']+)["']/i);
  if (boomrThemeMatch && boomrThemeMatch[1]) {
    if (!rawThemeName) {
      rawThemeName = boomrThemeMatch[1].trim();
      detectionSignals.push(`Theme Name via BOOMR Performance-Tracker erkannt: "${rawThemeName}"`);
    }
  }

  const boomrVersionMatch = html.match(/BOOMR\.themeVersion\s*=\s*["']([^"']+)["']/i);
  if (boomrVersionMatch && boomrVersionMatch[1]) {
    themeVersion = boomrVersionMatch[1].trim();
    detectionSignals.push(`Theme Version via BOOMR gefunden: v${themeVersion}`);
  }

  // Pattern C: HTML Comments / Header version inspection
  if (!themeVersion) {
    const versionCommentMatch = html.match(/(?:Theme|Version)[\s:-]+(?:v)?([0-9]+\.[0-9]+(?:\.[0-9]+)?)/i);
    if (versionCommentMatch && versionCommentMatch[1]) {
      themeVersion = versionCommentMatch[1];
    }
  }

  // Pattern D: Asset URLs check
  let assetsPath: string | undefined = undefined;
  const themeAssetMatch = html.match(/(?:href|src)=["']([^"']*\/cdn\/shop\/t\/([0-9]+)\/assets\/[^"']*)["']/i);
  if (themeAssetMatch) {
    assetsPath = themeAssetMatch[1];
    if (!themeId && themeAssetMatch[2]) {
      themeId = themeAssetMatch[2];
    }
  }

  // 3. Resolve Theme Details & Base Theme
  let cleanName = rawThemeName || "Unbekanntes Shopify Theme";
  let details: ShopifyThemeInfo | undefined = undefined;
  let isCustomTheme = false;
  let isCustomized = false;

  // Check in official catalog by themeStoreId first
  if (themeStoreId && SHOPIFY_THEME_CATALOG[themeStoreId]) {
    details = SHOPIFY_THEME_CATALOG[themeStoreId];
    cleanName = details.name;
    if (rawThemeName && rawThemeName.toLowerCase() !== details.name.toLowerCase()) {
      isCustomized = true;
    }
    detectionSignals.push(`Offizielles Theme im Shopify Catalog erkannt: ${details.name}`);
  } else {
    // Strip common store prefixes/suffixes for matching (e.g. [Live], (Copy), v1.0, - Production)
    const normalizedCandidateName = rawThemeName
      .replace(/\[.*?\]|\(.*?\)/g, "")
      .replace(/[-–|]\s*(?:live|production|staging|dev|backup|copy|neu|new|test).*/i, "")
      .replace(/v[0-9]+(?:\.[0-9]+)*/i, "")
      .trim();

    // If no themeStoreId or theme_store_id is null/0, check by name matching in catalog
    const matchedCatalogTheme = Object.values(SHOPIFY_THEME_CATALOG).find((t) => {
      const reg = new RegExp(`\\b${t.name}\\b`, "i");
      return reg.test(normalizedCandidateName) || reg.test(rawThemeName);
    });

    if (matchedCatalogTheme) {
      details = matchedCatalogTheme;
      themeStoreId = matchedCatalogTheme ? (Object.keys(SHOPIFY_THEME_CATALOG).find(k => SHOPIFY_THEME_CATALOG[Number(k)].name === matchedCatalogTheme.name) ? Number(Object.keys(SHOPIFY_THEME_CATALOG).find(k => SHOPIFY_THEME_CATALOG[Number(k)].name === matchedCatalogTheme.name)) : null) : null;
      cleanName = matchedCatalogTheme.name;
      isCustomized = true;
      detectionSignals.push(`Theme passt zum offiziellen Shopify Theme Store: "${matchedCatalogTheme.name}"`);
    } else {
      // Check in known external themes (ThemeForest, Out of the Sandbox, Debutify, etc.)
      const externalMatch = KNOWN_EXTERNAL_THEMES.find(
        (ext) => ext.namePattern.test(normalizedCandidateName) || ext.namePattern.test(rawThemeName)
      );
      if (externalMatch) {
        cleanName = externalMatch.name;
        details = {
          name: externalMatch.name,
          author: externalMatch.author,
          price: externalMatch.price,
          isFree: false,
          officialUrl: externalMatch.website,
          description: externalMatch.description,
          category: "Drittanbieter / Commercial",
        };
        isCustomized = rawThemeName.toLowerCase() !== externalMatch.name.toLowerCase();
        detectionSignals.push(`Bekanntes Premium-Drittanbieter-Theme erkannt: "${externalMatch.name}" von ${externalMatch.author}`);
      } else {
        // No match in any catalog -> likely custom developed or private theme
        isCustomTheme = !themeStoreId;
        isCustomized = true;
        cleanName = normalizedCandidateName || rawThemeName || "Individuelles Custom Theme";
        details = {
          name: cleanName,
          author: themeStoreId ? "Shopify Theme Store Partner" : "Individuelle Entwicklung / Agentur",
          price: themeStoreId ? "Theme Store Lizenz" : "Individuell angefertigt",
          isFree: false,
          officialUrl: themeStoreId
            ? `https://themes.shopify.com/search?q=${encodeURIComponent(cleanName)}`
            : undefined,
          description: themeStoreId
            ? `Dieses Theme ist im Shopify Theme Store registriert (ID #${themeStoreId}) und wurde vom Shop-Betreiber modifiziert.`
            : "Dieses Theme wurde maßgeschneidert oder basiert auf einem modifizierten Entwickler-Framework ohne direkte Verknüpfung zum Shopify Theme Store.",
          category: themeStoreId ? "Shopify Theme Store" : "Custom Development",
        };
        detectionSignals.push(
          themeStoreId
            ? `Theme Store ID #${themeStoreId} erfasst – Store-Suche verlinkt`
            : "Kein Theme-Store-Eintrag gefunden – Shop verwendet ein maßgeschneidertes Custom Theme"
        );
      }
    }
  }

  // 4. Online Store 2.0 Check
  const isOnlineStore20 =
    $('.shopify-section, [id^="shopify-section-"], main#MainContent, [data-section-type]').length > 0 ||
    /template-index|template-product|template-collection/i.test(html);

  // 5. Currency, Locale, Country detection
  let currency: string | undefined = undefined;
  const currencyMatch =
    html.match(/Shopify\.currency\s*=\s*{[^}]*?active:\s*["']([A-Z]{3})["']/i) ||
    html.match(/"currency"\s*:\s*"([A-Z]{3})"/i) ||
    html.match(/currencyCode["']?\s*:\s*["']([A-Z]{3})["']/i);
  if (currencyMatch) currency = currencyMatch[1];

  const locale = $("html").attr("lang") || undefined;

  // 6. Detect Third-Party Shopify Apps
  const detectedApps: DetectedApp[] = [];
  for (const app of APP_SIGNATURES) {
    if (app.pattern.test(html)) {
      detectedApps.push({
        name: app.name,
        category: app.category,
        website: app.website,
      });
    }
  }

  // 7. Store Metadata (Favicon, OG Image, Title)
  let favicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').attr("href");
  if (favicon && !favicon.startsWith("http")) {
    try {
      favicon = new URL(favicon, resolvedFinalUrl).href;
    } catch {
      // keep as is
    }
  }
  if (!favicon) {
    favicon = `https://${hostname}/favicon.ico`;
  }

  let ogImage = $('meta[property="og:image"]').attr("content");
  if (ogImage && !ogImage.startsWith("http")) {
    try {
      ogImage = new URL(ogImage, resolvedFinalUrl).href;
    } catch {
      // keep as is
    }
  }

  const siteNameMeta = $('meta[property="og:site_name"]').attr("content")?.trim();
  const rawTitle = $("title").first().text().trim();
  const firstTitleSegment = rawTitle ? rawTitle.split(/[-–|•:\n.]/)[0].trim() : "";
  const storeName = siteNameMeta || (firstTitleSegment.length > 1 && firstTitleSegment.length < 50 ? firstTitleSegment : hostname);
  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    undefined;

  return {
    url: normalizedUrl,
    finalUrl: resolvedFinalUrl,
    domain: hostname,
    isShopify: true,
    storeName,
    storeFavicon: favicon,
    ogImage,
    description,
    theme: {
      name: rawThemeName || cleanName,
      cleanName,
      themeStoreId,
      themeId,
      role: themeRole,
      version: themeVersion,
      isCustomized,
      isCustomTheme,
      details,
    },
    shopifyInfo: {
      currency,
      locale,
      isOnlineStore20,
      shopifyCdnFound: /cdn\.shopify\.com/i.test(html),
      hasCheckoutToken: $('meta[name="shopify-checkout-api-token"]').length > 0,
      assetsPath,
    },
    detectedApps,
    checkedAt,
    detectionSignals,
  };
}

export async function detectShopifyTheme(targetUrl: string): Promise<ThemeDetectionResult> {
  const { normalizedUrl, hostname } = cleanDomain(targetUrl);

  let response: Awaited<ReturnType<typeof safeFetch>>;
  try {
    response = await safeFetch(normalizedUrl, {
      timeoutMs: 12000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    throw new Error(
      `Verbindung zur URL konnte nicht hergestellt werden (${error.message || "Timeout/Netzwerkfehler"}). Bitte prüfe, ob die Domain erreichbar ist.`
    );
  }

  const finalUrl = response.url || normalizedUrl;
  const html = await response.text();

  return parseHtmlForShopifyTheme(html, normalizedUrl, hostname, response.headers as any, finalUrl);
}
