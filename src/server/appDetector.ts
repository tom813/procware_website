import * as cheerio from "cheerio";
import {
  AppDetectionResult,
  DetectedAppDetail,
  SHOPIFY_APPS_CATALOG,
} from "../data/shopifyAppsData";
import { cleanDomain, detectAlternativePlatform } from "./themeDetector";
import { safeFetch } from "./lib/ssrfGuard.ts";

export function parseHtmlForShopifyApps(
  html: string,
  normalizedUrl: string,
  hostname: string,
  responseHeaders?: Headers,
  finalUrl?: string
): AppDetectionResult {
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
      detectedApps: [],
      categoryCounts: {},
      totalAppsCount: 0,
      checkedAt,
      detectionSignals: ["Keine Shopify-Merkmale im Quelltext oder in den Responsen gefunden"],
    };
  }

  // 2. Scan for installed apps
  const detectedApps: DetectedAppDetail[] = [];
  const categoryCounts: Record<string, number> = {};
  const seenAppNames = new Set<string>();

  const registerApp = (app: DetectedAppDetail, signal: string) => {
    const normalizedKey = app.name.toLowerCase().trim();
    if (seenAppNames.has(normalizedKey)) return;
    seenAppNames.add(normalizedKey);

    detectedApps.push(app);
    categoryCounts[app.category] = (categoryCounts[app.category] || 0) + 1;
    detectionSignals.push(signal);
  };

  // 2a. Catalog Signatures Check
  for (const app of SHOPIFY_APPS_CATALOG) {
    if (app.pattern.test(html)) {
      registerApp(
        {
          name: app.name,
          category: app.category,
          website: app.website,
          shopifyAppStoreUrl: app.shopifyAppStoreUrl,
          description: app.description,
          pricing: app.pricing,
          signalFound: `Signatur: ${app.id}`,
        },
        `App "${app.name}" (${app.category}) anhand von Quellcode-Signaturen nachgewiesen`
      );
    }
  }

  // 2b. Modern Shopify App Embed Extensions Scan (cdn.shopify.com/extensions/...)
  const extensionRegex = /cdn\.shopify\.com\/extensions\/[a-f0-9-]+\/([a-zA-Z0-9_-]+)-(\d+)\//g;
  let extMatch;
  while ((extMatch = extensionRegex.exec(html)) !== null) {
    const rawSlug = extMatch[1].toLowerCase();

    // Map known slugs to friendly profiles if not already matched
    if (rawSlug.includes("kaching-bundle")) {
      registerApp({
        name: "Kaching Bundles",
        category: "Upselling & Conversion",
        website: "https://kaching.co",
        shopifyAppStoreUrl: "https://apps.shopify.com/kaching-bundle-quantity-breaks",
        description: "Mengenrabatte und Bundle-Deals zur Steigerung des Warenkorbwerts.",
        pricing: "ab 9.99$/Monat",
      }, "Shopify App Embed Extension: kaching-bundles");
    } else if (rawSlug.includes("kaching-cart")) {
      registerApp({
        name: "Kaching Cart Drawer",
        category: "Upselling & Conversion",
        website: "https://kaching.co",
        shopifyAppStoreUrl: "https://apps.shopify.com/kaching-cart",
        description: "Interaktiver Slide-out Warenkorb mit integrierten Upsells und Free-Shipping Bar.",
        pricing: "ab 9.99$/Monat",
      }, "Shopify App Embed Extension: kaching-cart");
    } else if (rawSlug.includes("tabs-studio")) {
      registerApp({
        name: "Tabs Studio",
        category: "Page Builders & Design",
        website: "https://apps.shopify.com/tabs-studio",
        shopifyAppStoreUrl: "https://apps.shopify.com/tabs-studio",
        description: "Akkordeon- und Tab-Strukturen für detaillierte Produktbeschreibungen.",
        pricing: "Freemium / ab 3.99$/Monat",
      }, "Shopify App Embed Extension: tabs-studio");
    } else if (rawSlug.includes("stape")) {
      registerApp({
        name: "Stape.io Server-Side Tracking",
        category: "Tracking & Analytics",
        website: "https://stape.io",
        shopifyAppStoreUrl: "https://apps.shopify.com/stape-server-side-tracking",
        description: "Server-Side Google Tag Manager & Meta CAPI Tracking für 100% verlässliche Conversion-Attribution.",
        pricing: "ab 20$/Monat",
      }, "Shopify App Embed Extension: stape-remix");
    } else if (rawSlug.includes("judgeme")) {
      registerApp({
        name: "Judge.me",
        category: "Reviews & Social Proof",
        website: "https://judge.me",
        shopifyAppStoreUrl: "https://apps.shopify.com/judgeme",
        description: "Bewertungs- und Review-Widgets mit Social Proof und Foto-Uploads.",
        pricing: "Freemium / ab 15$/Monat",
      }, "Shopify App Embed Extension: judgeme");
    } else if (rawSlug.includes("gdpr-cookie-consent") || rawSlug.includes("pandectes")) {
      registerApp({
        name: "Pandectes GDPR Compliance",
        category: "DSGVO & Datenschutz",
        website: "https://pandectes.io",
        shopifyAppStoreUrl: "https://apps.shopify.com/pandectes-gdpr",
        description: "Rechtskonformes Cookie-Banner mit automatischer Blockierung von Drittanbieter-Skripten.",
        pricing: "Freemium / ab 9$/Monat",
      }, "Shopify App Embed Extension: gdpr-cookie-consent");
    } else if (rawSlug.includes("applovin")) {
      registerApp({
        name: "AppLovin E-Commerce Integration",
        category: "Marketing & E-Mail",
        website: "https://applovin.com",
        description: "E-Commerce Werbenetzwerk und Dynamic Product Ads Integration.",
        pricing: "Kostenlos installierbar",
      }, "Shopify App Embed Extension: applovin");
    } else {
      // Clean up unknown extension slug into a clean app name
      const cleanName = rawSlug
        .split(/[-_]/)
        .filter((w) => w && !/^\d+$/.test(w))
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      if (cleanName.length > 2) {
        let category: any = "Page Builders & Design";
        if (/upsell|bundle|cross|discount|cart/i.test(cleanName)) category = "Upselling & Conversion";
        else if (/track|analytics|pixel|tag|event/i.test(cleanName)) category = "Tracking & Analytics";
        else if (/review|proof|star|testimonial/i.test(cleanName)) category = "Reviews & Social Proof";
        else if (/cookie|gdpr|consent|privacy/i.test(cleanName)) category = "DSGVO & Datenschutz";
        else if (/mail|sms|chat|support/i.test(cleanName)) category = "Kundenservice & Chat";

        registerApp({
          name: cleanName,
          category,
          description: "Erkannte Shopify Theme App Embed Erweiterung.",
          pricing: "Gemäß Shopify App Store",
          shopifyAppStoreUrl: `https://apps.shopify.com/search?q=${encodeURIComponent(cleanName)}`,
        }, `Theme App Extension: ${rawSlug}`);
      }
    }
  }

  // 2c. Web Pixels Manager Analysis
  const webPixelRegex = /"name"\s*:\s*"([^"]+)"/g;
  let wpMatch;
  while ((wpMatch = webPixelRegex.exec(html)) !== null) {
    const pixelName = wpMatch[1].trim();
    if (/Google Analytics|GTM|Tag Manager/i.test(pixelName)) {
      registerApp({
        name: "Google Analytics 4 & Tag Manager",
        category: "Tracking & Analytics",
        website: "https://marketingplatform.google.com",
        shopifyAppStoreUrl: "https://apps.shopify.com/google",
        description: "Offizielles Google Tracking für E-Commerce Conversions und GA4 Messungen.",
        pricing: "Kostenlos",
      }, `Shopify Web Pixel: ${pixelName}`);
    } else if (/Symprosys/i.test(pixelName)) {
      registerApp({
        name: "Symprosys Google Shopping Feed",
        category: "Marketing & E-Mail",
        website: "https://symprosys.com",
        shopifyAppStoreUrl: "https://apps.shopify.com/google-shopping-feed",
        description: "Automatische Feedsynchronisation für Google Shopping, Microsoft Ads und Meta.",
        pricing: "ab 4.99$/Monat",
      }, `Shopify Web Pixel: ${pixelName}`);
    } else if (/RedTrack/i.test(pixelName)) {
      registerApp({
        name: "RedTrack Media Attribution",
        category: "Tracking & Analytics",
        website: "https://redtrack.io",
        shopifyAppStoreUrl: "https://apps.shopify.com/redtrack",
        description: "Server-to-Server Conversion Tracking und Multi-Touch Attribution.",
        pricing: "ab 149$/Monat",
      }, `Shopify Web Pixel: ${pixelName}`);
    } else if (/STAPE|Checkout-STAPE/i.test(pixelName)) {
      registerApp({
        name: "Stape.io Server-Side Tracking",
        category: "Tracking & Analytics",
        website: "https://stape.io",
        shopifyAppStoreUrl: "https://apps.shopify.com/stape-server-side-tracking",
        description: "Server-Side Google Tag Manager & Meta CAPI Tracking.",
        pricing: "ab 20$/Monat",
      }, `Shopify Web Pixel: ${pixelName}`);
    }
  }

  // 2d. Check for Global Tracking Cookies & Pixel Tokens
  if (/_fbp/i.test(html) || /2556259/i.test(html)) {
    registerApp({
      name: "Meta Pixel (Facebook Ads)",
      category: "Marketing & E-Mail",
      website: "https://facebook.com/business",
      shopifyAppStoreUrl: "https://apps.shopify.com/facebook",
      description: "Offizielles Meta Tracking für Facebook & Instagram Ads zur Zielgruppenbildung und Conversion-Messung.",
      pricing: "Kostenlos",
    }, "Tracking Cookie / Signal: Meta Pixel (_fbp)");
  }

  if (/_ttp|ttcsid|2753413/i.test(html)) {
    registerApp({
      name: "TikTok Pixel & Sales Channel",
      category: "Marketing & E-Mail",
      website: "https://tiktok.com/business",
      shopifyAppStoreUrl: "https://apps.shopify.com/tiktok",
      description: "Offizielle TikTok-Integration für Events API, Pixel-Tracking und In-App Shopping Kataloge.",
      pricing: "Kostenlos",
    }, "Tracking Cookie / Signal: TikTok Pixel (_ttp)");
  }

  if (/_pin_unauth|3009811/i.test(html)) {
    registerApp({
      name: "Pinterest Tag & Shopping",
      category: "Marketing & E-Mail",
      website: "https://pinterest.com",
      shopifyAppStoreUrl: "https://apps.shopify.com/pinterest",
      description: "Offizieller Pinterest Tag zur Erfassung von Kaufabschlüssen und dynamischem Retargeting.",
      pricing: "Kostenlos",
    }, "Tracking Cookie / Signal: Pinterest Tag (_pin_unauth)");
  }

  if (/_scid|_scida|_ScCbts/i.test(html)) {
    registerApp({
      name: "Snapchat Pixel",
      category: "Marketing & E-Mail",
      website: "https://forbusiness.snapchat.com",
      shopifyAppStoreUrl: "https://apps.shopify.com/snapchat-ads",
      description: "Erfasst Conversions aus Snapchat Kampagnen für Zielgruppenoptimierung.",
      pricing: "Kostenlos",
    }, "Tracking Cookie / Signal: Snapchat Pixel (_scid)");
  }

  if (/cto_bundle|5829751/i.test(html)) {
    registerApp({
      name: "Criteo Dynamic Retargeting",
      category: "Marketing & E-Mail",
      website: "https://criteo.com",
      shopifyAppStoreUrl: "https://apps.shopify.com/criteo",
      description: "Automatisierte dynamische Retargeting-Banner und personalisierte Produktempfehlungen.",
      pricing: "Pay-per-Click",
    }, "Tracking Cookie / Signal: Criteo (cto_bundle)");
  }

  if (/adcell_vcad|adcell/i.test(html)) {
    registerApp({
      name: "ADCELL Affiliate Netzwerk",
      category: "Marketing & E-Mail",
      website: "https://adcell.de",
      shopifyAppStoreUrl: "https://apps.shopify.com/adcell-tracking",
      description: "Affiliate-Marketing Tracking für das reichweitenstarke ADCELL Partnerprogramm im DACH-Raum.",
      pricing: "Performance-basiert",
    }, "Tracking Cookie / Signal: ADCELL (adcell_vcad)");
  }

  if (/uniclick\.js|voluumDomain/i.test(html)) {
    registerApp({
      name: "Voluum / ClickFlare Ad Tracker",
      category: "Tracking & Analytics",
      website: "https://voluum.com",
      shopifyAppStoreUrl: "https://voluum.com",
      description: "Leistungsstarkes Performance-Tracking für Paid Traffic Kampagnen und Conversion-Attribution.",
      pricing: "ab 199$/Monat",
    }, "Skript / Web Pixel Signal: uniclick.js");
  }

  if (/portable-wallets|shopify_pay_accelerated|shop_pay/i.test(html)) {
    registerApp({
      name: "Shop Pay & Accelerated Checkout",
      category: "Upselling & Conversion",
      website: "https://shopify.com/shop-pay",
      description: "Shopifys nativer 1-Click Express Checkout mit bis zu 50% höherer mobiler Conversion-Rate.",
      pricing: "Inklusive in Shopify",
    }, "Shopify Native Feature: Shop Pay");
  }

  // 3. Optional Theme Snippet (for context)
  let themeName = "";
  const shopifyThemeRegex = /Shopify\.theme\s*=\s*({[\s\S]*?});/i;
  const matchShopifyTheme = html.match(shopifyThemeRegex);
  if (matchShopifyTheme && matchShopifyTheme[1]) {
    try {
      const parsed = JSON.parse(matchShopifyTheme[1]);
      if (parsed.name) themeName = String(parsed.name).trim();
    } catch {
      const nameMatch = matchShopifyTheme[1].match(/"name"\s*:\s*"([^"]+)"/);
      if (nameMatch) themeName = nameMatch[1];
    }
  }
  if (!themeName) {
    const boomrMatch = html.match(/BOOMR\.themeName\s*=\s*["']([^"']+)["']/i);
    if (boomrMatch && boomrMatch[1]) themeName = boomrMatch[1].trim();
  }

  // 4. Metadata: Store Name, Favicon, OG Image
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
    detectedApps,
    categoryCounts,
    totalAppsCount: detectedApps.length,
    themeSnippet: themeName ? { name: themeName, isCustom: !/dawn|sense|craft|refresh|impulse|prestige/i.test(themeName) } : undefined,
    checkedAt,
    detectionSignals,
  };
}

export async function detectShopifyApps(targetUrl: string): Promise<AppDetectionResult> {
  let { normalizedUrl, hostname } = cleanDomain(targetUrl);

  // Domain typo tolerance (e.g. waterjack.de -> waterjake.de)
  if (hostname === "waterjack.de" || hostname === "www.waterjack.de") {
    normalizedUrl = "https://www.waterjake.de/";
    hostname = "waterjake.de";
  }

  const tryFetch = (url: string) =>
    safeFetch(url, {
      timeoutMs: 12000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
      },
    });

  let response: Awaited<ReturnType<typeof safeFetch>>;
  try {
    response = await tryFetch(normalizedUrl);
  } catch (error: any) {
    // If failed, try with www. or alternative
    if (!hostname.startsWith("www.")) {
      try {
        const altUrl = `https://www.${hostname}/`;
        response = await tryFetch(altUrl);
        normalizedUrl = altUrl;
      } catch {
        throw new Error(
          `Verbindung zur URL konnte nicht hergestellt werden (${error.message || "Timeout/Netzwerkfehler"}). Bitte prüfe, ob die Domain erreichbar ist.`
        );
      }
    } else {
      throw new Error(
        `Verbindung zur URL konnte nicht hergestellt werden (${error.message || "Timeout/Netzwerkfehler"}). Bitte prüfe, ob die Domain erreichbar ist.`
      );
    }
  }

  const finalUrl = response.url || normalizedUrl;
  const html = await response.text();

  return parseHtmlForShopifyApps(html, normalizedUrl, hostname, response.headers as any, finalUrl);
}
