/**
 * SEO & Internationalization Utility for Procware Tools & Pages
 */

export interface ToolSeoConfig {
  de: {
    title: string;
    description: string;
    canonicalPath: string;
    keywords: string;
  };
  en: {
    title: string;
    description: string;
    canonicalPath: string;
    keywords: string;
  };
}

export const TOOLS_SEO: Record<string, ToolSeoConfig> = {
  tools: {
    de: {
      title: "Kostenlose E-Commerce Tools & Rechner für Shopify | Procware",
      description: "9 kostenlose E-Commerce Tools für deinen Shopify Store: Barcode Generator, Fee Calculator, ROAS Rechner, Margenrechner, Theme Detector & Liquiditätsplanung.",
      canonicalPath: "/tools",
      keywords: "e-commerce tools, shopify rechner, margenrechner, barcode generator, shopify fee calculator, roas rechner",
    },
    en: {
      title: "Free E-Commerce Tools & Calculators for Shopify Stores | Procware",
      description: "Free E-Commerce tools and calculators for Shopify sellers: Barcode & GTIN Generator, Shopify Fee Calculator, ROAS & Break-Even, Profit Margin Calculator, and Cash Flow Planner.",
      canonicalPath: "/en/tools",
      keywords: "free ecommerce tools, shopify fee calculator, barcode generator, shopify margin calculator, roas calculator, shopify theme detector",
    },
  },
  barcode: {
    de: {
      title: "Kostenloser Barcode & GTIN Generator | EAN-13, Code 128, UPC | Procware",
      description: "Generiere Barcodes (EAN-13, Code 128, UPC-A, EAN-8) für deinen Shopify Store. Kostenloser hochauflösender Download als SVG und PNG mit Druckvorschau.",
      canonicalPath: "/barcode-generator",
      keywords: "barcode generator, gtin generator, ean 13 generator, code 128 generator, upc generator, etiketten drucken",
    },
    en: {
      title: "Free Barcode & GTIN Generator for E-Commerce | EAN-13, Code 128, UPC | Procware",
      description: "Free online Barcode and GTIN Generator for Shopify and E-Commerce. Create Code 128, EAN-13, UPC-A, and EAN-8 barcodes with instant SVG and PNG vector download.",
      canonicalPath: "/en/barcode-generator",
      keywords: "free barcode generator, gtin generator ecommerce, ean-13 generator, code 128 svg download, upc barcode maker",
    },
  },
  themeDetector: {
    de: {
      title: "Shopify Theme Detector | Finde das Theme jedes Stores heraus | Procware",
      description: "Kostenloser Shopify Theme Detector: Erkenne mit 1 Klick das Theme, Theme-Details, Online Store 2.0 Status und Drittanbieter-Apps jedes Shopify Stores.",
      canonicalPath: "/shopify-theme-detector",
      keywords: "shopify theme detector, theme finder shopify, welches theme nutzt der shop, shopify spionage tool",
    },
    en: {
      title: "Shopify Theme Detector - Detect any Store's Theme in 1 Click | Procware",
      description: "Free Shopify Theme Detector: Instantly discover the theme, theme version, Online Store 2.0 status, and apps used by any Shopify store.",
      canonicalPath: "/en/shopify-theme-detector",
      keywords: "shopify theme detector, what shopify theme is that, detect shopify theme, find shopify theme name",
    },
  },
  appDetector: {
    de: {
      title: "Shopify App Detector | Erkannte Apps & Tracking-Pixel analysieren | Procware",
      description: "Analysiere jeden Shopify Store: Finde installierte Marketing-Apps, Review-Apps, Upsell-Plugins und Tracking-Pixel deiner Wettbewerber heraus.",
      canonicalPath: "/shopify-app-detector",
      keywords: "shopify app detector, shopify app finder, welche apps nutzt shopify, shopify plugins analysieren",
    },
    en: {
      title: "Shopify App Detector - Discover Installed Apps, Plugins & Pixels | Procware",
      description: "Free Shopify App Detector: Uncover all marketing apps, review widgets, upsell tools, and tracking pixels running on any competitor's Shopify store.",
      canonicalPath: "/en/shopify-app-detector",
      keywords: "shopify app detector, find shopify apps, inspect shopify store apps, ecommerce spy tool",
    },
  },
  feeCalculator: {
    de: {
      title: "Shopify Fee Calculator & Gebühren Rechner 2026 | Procware",
      description: "Berechne monatliche und jährliche Shopify Kosten für Basic, Shopify, Advanced & Plus inklusive Kreditkarten-, PayPal- und Drittanbieter-Transaktionsgebühren.",
      canonicalPath: "/shopify-fee-calculator",
      keywords: "shopify fee calculator, shopify gebühren rechner, shopify kosten berechnen, shopify plus gebühren, shopify payments gebühren",
    },
    en: {
      title: "Shopify Fee Calculator 2026 - Monthly Plans & Transaction Cost Estimator | Procware",
      description: "Free Shopify Fee Calculator: Accurately calculate monthly subscription costs, Shopify Payments processing rates, and external gateway transaction fees for Basic, Shopify, Advanced & Plus.",
      canonicalPath: "/en/shopify-fee-calculator",
      keywords: "shopify fee calculator, calculate shopify fees, shopify plan comparison calculator, shopify payment fees, transaction fees shopify",
    },
  },
  roasCalculator: {
    de: {
      title: "ROAS Rechner Online Shop | Return on Ad Spend & CPA Rechner | Procware",
      description: "Kostenloser ROAS Rechner für E-Commerce & Shopify: Berechne Return on Ad Spend, Kosten-Umsatz-Relation (KUR), Werbegewinn und CPA für Meta-, Google- & TikTok-Ads.",
      canonicalPath: "/roas-calculator",
      keywords: "roas rechner, return on ad spend berechnen, kur rechner, ad spend kalkulator, roas formel",
    },
    en: {
      title: "ROAS Calculator for E-Commerce - Return on Ad Spend & Profit Estimator | Procware",
      description: "Free ROAS Calculator for Shopify and DTC brands: Calculate Return on Ad Spend (ROAS), Cost of Sale (CoS), ad profit, and CPA for Facebook, TikTok & Google Ads.",
      canonicalPath: "/en/roas-calculator",
      keywords: "roas calculator, return on ad spend calculator, calculate roas ecommerce, facebook ads roas calculator, ad profit calculator",
    },
  },
  breakEvenRoas: {
    de: {
      title: "Break Even ROAS Rechner | Mindest-ROAS & Maximaler CPA | Procware",
      description: "Berechne den genauen Break Even ROAS für deinen Online Shop unter Berücksichtigung von Wareneinsatz (COGS), Retourenquote, Fulfillment und Zahlungsgebühren.",
      canonicalPath: "/break-even-roas-calculator",
      keywords: "break even roas rechner, be roas kalkulator, mindest roas berechnen, maximaler cpa, profitabler werbedruck",
    },
    en: {
      title: "Break-Even ROAS Calculator - Minimum ROAS & Maximum CPA for E-Commerce | Procware",
      description: "Calculate your exact Break-Even ROAS and maximum acceptable Customer Acquisition Cost (CPA) taking into account COGS, return rates, fulfillment, and payment fees.",
      canonicalPath: "/en/break-even-roas-calculator",
      keywords: "break even roas calculator, minimum roas calculator, target roas formula, max cpa calculator ecommerce",
    },
  },
  marginCalculator: {
    de: {
      title: "Shopify Margenrechner | Deckungsbeitrag 1, 2, 3 & Stückgewinn | Procware",
      description: "Kostenloser Margenrechner für Shopify & Dropshipping: Berechne Netto-Marge, Deckungsbeiträge, Mindestverkaufspreis und Aufschlagsfaktor pro Produkt.",
      canonicalPath: "/shopify-margenrechner",
      keywords: "shopify margenrechner, margen kalkulator ecommerce, deckungsbeitrag berechnen, stückkosten gewinnspanne",
    },
    en: {
      title: "Shopify Profit Margin Calculator - Gross Margin, Markup & Profit per Unit | Procware",
      description: "Free Profit Margin Calculator for Shopify & E-Commerce: Calculate gross margin, contribution margin (CM1/CM2), markup multiplier, and target retail price.",
      canonicalPath: "/en/shopify-margin-calculator",
      keywords: "shopify margin calculator, ecommerce profit margin calculator, gross margin calculator, product markup calculator",
    },
  },
  liquidity: {
    de: {
      title: "Liquiditätsplanung Online Shop | 6-Monats Cashflow-Simulation | Procware",
      description: "Liquiditätsrechner für E-Commerce & Shopify: Simuliere Wareneinkauf, Vorfinanzierung, Zahlungsziele und Marketing-Spend über 6 Monate zur Vermeidung von Liquiditätsengpässen.",
      canonicalPath: "/liquiditaetsplanung-online-shop",
      keywords: "liquiditätsplanung online shop, cashflow rechner e-commerce, liquiditätsrechner shopify, wareneinkauf vorfinanzieren",
    },
    en: {
      title: "E-Commerce Cash Flow & Liquidity Planner for Shopify Stores | Procware",
      description: "Free 6-month E-Commerce Cash Flow & Liquidity Planner: Simulate inventory pre-financing, payout terms, marketing ad spend, and working capital needs.",
      canonicalPath: "/en/cash-flow-planner-online-shop",
      keywords: "ecommerce cash flow planner, liquidity calculator shopify, inventory working capital calculator, online store financial projection",
    },
  },
  clv: {
    de: {
      title: "Customer Lifetime Value (CLV) Rechner für Online Shops | Procware",
      description: "Berechne den Kundenwert (CLV) für deinen Shopify Store: Ermittle den profitbasierten Kundenwert, CLV:CAC Verhältnis und wie viel du für Neukunden ausgeben kannst.",
      canonicalPath: "/customer-lifetime-value-calculator",
      keywords: "customer lifetime value rechner, clv calculator, kundenwert berechnen, clv cac ratio, wiederkaufsrate",
    },
    en: {
      title: "Customer Lifetime Value (CLV) Calculator for E-Commerce & Shopify | Procware",
      description: "Free Customer Lifetime Value (CLV) Calculator for Shopify stores: Calculate customer lifetime profit, repurchase cycles, CLV:CAC ratio, and maximum profitable acquisition cost.",
      canonicalPath: "/en/customer-lifetime-value-calculator",
      keywords: "customer lifetime value calculator, clv calculator ecommerce, calculate clv shopify, clv to cac ratio calculator",
    },
  },
  safetyStock: {
    de: {
      title: "Safety Stock & Meldebestand Rechner | Formel & Berechnung | Procware",
      description: "Kostenloser Rechner für Meldebestand & Safety Stock (Sicherheitsbestand): Berechne den optimalen Bestellzeitpunkt, Pufferbestand und Kapitalbindung mit Min-Max- und Service-Level-Formel.",
      canonicalPath: "/safety-stock-calculator",
      keywords: "safety stock calculator, meldebestand rechner, safety stock formel, meldebestand formel, meldebestand berechnung, sicherheitsbestand rechner, reorder point calculator",
    },
    en: {
      title: "Safety Stock & Reorder Point (ROP) Calculator | Formulas & Calculation | Procware",
      description: "Free Safety Stock and Reorder Point (ROP) Calculator: Calculate exact reorder triggers, buffer inventory, and tied-up working capital with classical Min-Max and statistical service level formulas.",
      canonicalPath: "/en/safety-stock-calculator",
      keywords: "safety stock calculator, reorder point calculator, safety stock formula, meldebestand formel, meldebestand berechnung, reorder point formula, calculate reorder point",
    },
  },
  shopifySalesTracker: {
    de: {
      title: "Shopify Sales Tracker & Estimator: Shopify Umsatz sehen (Free) | Procware",
      description: "Kostenloser Shopify Sales Tracker: Finde heraus wie viel Umsatz jeder Shopify Store macht. Shopify Umsatz sehen, Bestseller analysieren und tägliche Verkaufszahlen schätzen.",
      canonicalPath: "/shopify-sales-tracker",
      keywords: "Shopify Sales Tracker, Shopify Sales Tracker Free, Shopify Umsatz, Shopify Umsatz sehen, Shopify Sales Estimator",
    },
    en: {
      title: "Shopify Sales Tracker & Sales Estimator (Free) | Track Store Revenue | Procware",
      description: "Free Shopify Sales Tracker and Sales Estimator: Track any Shopify store's daily revenue, units sold, and best-selling products. See any Shopify store sales volume for free.",
      canonicalPath: "/en/shopify-sales-tracker",
      keywords: "Shopify Sales Tracker, Shopify Sales Tracker Free, Shopify Umsatz, Shopify Umsatz sehen, Shopify Sales Estimator",
    },
  },
  trendingProducts: {
    de: {
      title: "Trending Products Finder: Trending Products for Dropshipping & E-Commerce 2026 | Procware",
      description: "Finde verifizierte Trending Products for Dropshipping und E-Commerce: Entdecke virale Shopify Trending Products, 7-Tage-Verkaufssprünge und Meta Ad Spend vor der Marktsättigung.",
      canonicalPath: "/trending-products",
      keywords: "Trending Products, Trending Products for Dropshipping, E-commerce Trending Products, Shopify Trending Products",
    },
    en: {
      title: "Trending Products Finder: Best Trending Products for Dropshipping & Shopify | Procware",
      description: "Find high-margin Trending Products for Dropshipping and E-commerce: Track viral Shopify Trending Products, 7-day velocity spikes, and supplier margins.",
      canonicalPath: "/en/trending-products",
      keywords: "Trending Products, Trending Products for Dropshipping, E-commerce Trending Products, Shopify Trending Products",
    },
  },
  competitorPriceTracker: {
    de: {
      title: "Competitor Price Tracker: Konkurrenz- & Mitbewerber-Preise überwachen | Procware",
      description: "Professioneller Competitor Price Tracker für E-Commerce & Shopify: Überwache Preise deiner Wettbewerber automatisiert, erhalte Sofort-Alerts bei Preissenkungen und schütze deine Marge.",
      canonicalPath: "/competitor-price-tracker",
      keywords: "Competitor Price Tracker, Competitor Price Tracker Free, Mitbewerber Preis Tracker, Preisüberwachung E-Commerce, Shopify Preis Tracker",
    },
    en: {
      title: "Competitor Price Tracker for E-Commerce & Shopify | Live Price Alerts | Procware",
      description: "Free Competitor Price Tracker for online stores: Monitor competitor prices automatically, receive instant alerts on price changes, and defend your profit margins.",
      canonicalPath: "/en/competitor-price-tracker",
      keywords: "Competitor Price Tracker, Competitor Price Tracker Free, Price Tracker Ecommerce, Shopify Price Monitor",
    },
  },
};

/**
 * Apply SEO meta tags, title, canonicals and hreflang
 */
export function applyToolSeo(toolKey: string, lang: "de" | "en") {
  const config = TOOLS_SEO[toolKey];
  if (!config) return;

  const current = config[lang];
  const alternate = config[lang === "de" ? "en" : "de"];

  // Set Document Title
  document.title = current.title;

  // Set Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", current.description);

  // Set Keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute("content", current.keywords);

  // Set Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", window.location.origin + current.canonicalPath);

  // Set Hreflang Tags
  let hreflangDe = document.querySelector('link[rel="alternate"][hreflang="de"]');
  if (!hreflangDe) {
    hreflangDe = document.createElement("link");
    hreflangDe.setAttribute("rel", "alternate");
    hreflangDe.setAttribute("hreflang", "de");
    document.head.appendChild(hreflangDe);
  }
  hreflangDe.setAttribute("href", window.location.origin + config.de.canonicalPath);

  let hreflangEn = document.querySelector('link[rel="alternate"][hreflang="en"]');
  if (!hreflangEn) {
    hreflangEn = document.createElement("link");
    hreflangEn.setAttribute("rel", "alternate");
    hreflangEn.setAttribute("hreflang", "en");
    document.head.appendChild(hreflangEn);
  }
  hreflangEn.setAttribute("href", window.location.origin + config.en.canonicalPath);

  // Document language attribute
  document.documentElement.lang = lang;
}
