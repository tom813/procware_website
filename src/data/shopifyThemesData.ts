export interface ShopifyThemeInfo {
  name: string;
  author: string;
  price: string;
  isFree: boolean;
  officialUrl?: string;
  description: string;
  category: string;
  features?: string[];
}

export interface DetectedApp {
  name: string;
  category: string;
  website?: string;
}

export interface ThemeDetectionResult {
  url: string;
  finalUrl: string;
  domain: string;
  isShopify: boolean;
  alternativePlatform?: string;
  storeName?: string;
  storeFavicon?: string;
  ogImage?: string;
  description?: string;
  theme: {
    name: string;
    cleanName: string;
    themeStoreId: number | null;
    themeId?: string | number;
    role?: string;
    version?: string;
    isCustomized: boolean;
    isCustomTheme: boolean;
    details?: ShopifyThemeInfo;
  } | null;
  shopifyInfo?: {
    currency?: string;
    locale?: string;
    isOnlineStore20: boolean;
    shopifyCdnFound: boolean;
    hasCheckoutToken: boolean;
    assetsPath?: string;
  };
  detectedApps: DetectedApp[];
  checkedAt: string;
  detectionSignals: string[];
}

export const SHOPIFY_THEME_CATALOG: Record<number, ShopifyThemeInfo> = {
  887: {
    name: "Dawn",
    author: "Shopify",
    price: "Kostenlos",
    isFree: true,
    officialUrl: "https://themes.shopify.com/themes/dawn",
    category: "Allrounder / Standard",
    description: "Das moderne Standard-Theme von Shopify für Online Store 2.0. Extrem schnell, schlank und anpassbar.",
    features: ["HTML5 & CSS3 ohne jQuery", "Optimiert für Core Web Vitals", "Modulare Sections auf allen Seiten"],
  },
  829: {
    name: "Impulse",
    author: "Archetype Themes",
    price: "380 USD",
    isFree: false,
    officialUrl: "https://themes.shopify.com/themes/impulse",
    category: "Fashion & Lifestyle",
    description: "Eines der beliebtesten Premium-Themes weltweit für visuell anspruchsvolle Marken und große Produktkataloge.",
    features: ["Subkollektions-Navigation", "Erweiterte Filterung", "Verkaufsfördernde Promotions-Banner"],
  },
  796: {
    name: "Prestige",
    author: "Maestrooo",
    price: "380 USD",
    isFree: false,
    officialUrl: "https://themes.shopify.com/themes/prestige",
    category: "Luxury & Editorial",
    description: "Perfekt für High-End-Marken, Schmuck, Kosmetik und Luxusartikel mit edler Magazin-Ästhetik.",
    features: ["Editorial Storytelling", "Lookbook & Hotspots", "Exzellente Typografie & Bilddarstellung"],
  },
  841: {
    name: "Warehouse",
    author: "Maestrooo",
    price: "320 USD",
    isFree: false,
    officialUrl: "https://themes.shopify.com/themes/warehouse",
    category: "Große Kataloge & Dropshipping",
    description: "Entwickelt für Elektronik, Baumärkte und Shops mit tausenden Artikeln und Fokus auf Conversion.",
    features: ["Bestandsanzeigen in Echtzeit", "Umfangreiche Facettensuche", "Amazon-ähnliches Einkaufserlebnis"],
  },
  826: {
    name: "Motion",
    author: "Archetype Themes",
    price: "360 USD",
    isFree: false,
    officialUrl: "https://themes.shopify.com/themes/motion",
    category: "Dynamisch & Video-Fokus",
    description: "Bringt Produkte mit eleganten Video-Loops und flüssigen Animationen zum Leben.",
    features: ["Autoplay-Videos", "Animierte Übergänge", "Produkt-Highlights"],
  },
  891: {
    name: "Sense",
    author: "Shopify",
    price: "Kostenlos",
    isFree: true,
    officialUrl: "https://themes.shopify.com/themes/sense",
    category: "Beauty & Health",
    description: "Ein lebendiges, frisches Gratis-Theme von Shopify für Kosmetik, Nahrungsergänzung und Drogerie.",
    features: ["Vertrauensbildende Testimonial-Sektionen", "Produktbewertungs-Layouts", "Sanfte Farbverläufe"],
  },
  890: {
    name: "Craft",
    author: "Shopify",
    price: "Kostenlos",
    isFree: true,
    officialUrl: "https://themes.shopify.com/themes/craft",
    category: "Artisan & Handmade",
    description: "Ruhiges, elegantes Layout für Kunsthandwerk, Home & Living und nachhaltige Marken.",
    features: ["Großzügiger Weißraum", "Klassische Serifenschriften", "Storytelling-Fokus"],
  },
  893: {
    name: "Refresh",
    author: "Shopify",
    price: "Kostenlos",
    isFree: true,
    officialUrl: "https://themes.shopify.com/themes/refresh",
    category: "Bold & Technical",
    description: "Klare Schriftarten und scharfe Linien betonen technische Produkte und Qualität.",
    features: ["Akkordeons für Spezifikationen", "Zertifikats-Badges", "Minimalistisches Design"],
  },
  892: {
    name: "Studio",
    author: "Shopify",
    price: "Kostenlos",
    isFree: true,
    officialUrl: "https://themes.shopify.com/themes/studio",
    category: "Kunst & Galerien",
    description: "Kuratierte Layouts für Künstler, Designer und Galeristen mit Fokus auf visuelle Ästhetik.",
    features: ["Künstlerbiografien", "Großformatige Bildgitter", "Minimaler Checkout"],
  },
  889: {
    name: "Crave",
    author: "Shopify",
    price: "Kostenlos",
    isFree: true,
    officialUrl: "https://themes.shopify.com/themes/crave",
    category: "Food & Beverage",
    description: "Lebendige Farben und verspielte Elemente für Food, Drinks und Lifestyle-Marken.",
    features: ["Zutatenlisten-Sektion", "Mobile-Optimierter Warenkorb", "Schnelle Kachelansicht"],
  },
  896: {
    name: "Publisher",
    author: "Shopify",
    price: "Kostenlos",
    isFree: true,
    officialUrl: "https://themes.shopify.com/themes/publisher",
    category: "Bücher, Musik & Medien",
    description: "Progressives Layout für Verlage, Musik-Labels und Apparel.",
    features: ["Dunkle Farbschemata", "Typografische Schwerpunkte", "Kontextuelle Navigation"],
  },
  868: {
    name: "Symmetry",
    author: "Clean Canvas Ltd",
    price: "380 USD",
    isFree: false,
    officialUrl: "https://themes.shopify.com/themes/symmetry",
    category: "Fashion & Department Stores",
    description: "Vielseitiges Premium-Theme mit vier verschiedenen Stilen für High-Volume-Brands.",
    features: ["Multi-Level Dropdown Menüs", "Schnellansicht", "Kollektionsfilter"],
  },
  848: {
    name: "Broadcast",
    author: "Invisible Themes",
    price: "360 USD",
    isFree: false,
    officialUrl: "https://themes.shopify.com/themes/broadcast",
    category: "Direct to Consumer",
    description: "Gebaut für schnelle Ladezeiten und mobile Conversions mit über 20 vorgefertigten Abschnitten.",
    features: ["1-Klick Upsells", "Farb-Swatches", "Story-Feature"],
  },
  877: {
    name: "Focal",
    author: "Maestrooo",
    price: "320 USD",
    isFree: false,
    officialUrl: "https://themes.shopify.com/themes/focal",
    category: "Modern Grid",
    description: "Fokus auf elegante Rasterlayouts und interaktive Produktraster.",
    features: ["Cross-Selling Sektionen", "Interaktive Farbfilter", "Flüssiges Lazy Loading"],
  },
};

export const KNOWN_EXTERNAL_THEMES = [
  {
    name: "Debutify",
    author: "Debutify Inc.",
    price: "Freemium / ab 29 USD/Monat",
    website: "https://debutify.com",
    description: "Eines der weltweit am häufigsten verwendeten High-Conversion Dropshipping-Themes.",
    namePattern: /debutify/i,
  },
  {
    name: "Ella",
    author: "HaloThemes",
    price: "89 USD (ThemeForest)",
    website: "https://themeforest.net/item/ella-responsive-shopify-template/13014019",
    description: "Bestseller-Multipurpose-Theme auf Envato / ThemeForest mit dutzenden vorgefertigten Layouts.",
    namePattern: /\bella\b/i,
  },
  {
    name: "Fastor",
    author: "RoarTheme",
    price: "56 USD (ThemeForest)",
    website: "https://themeforest.net/item/fastor-multipurpose-shopify-sections-theme/18095407",
    description: "Vielseitiges ThemeForest-Theme mit zahlreichen App-Integrationen.",
    namePattern: /fastor/i,
  },
  {
    name: "Booster",
    author: "Booster Theme",
    price: "399 USD / Jahr",
    website: "https://boostertheme.com",
    description: "Konvertierungs-fokussiertes Theme mit integrierten Countdown-Timern und Upsells.",
    namePattern: /booster/i,
  },
  {
    name: "Shrine Pro",
    author: "Shrine Theme",
    price: "199 USD",
    website: "https://shrinetheme.com",
    description: "Sehr beliebtes D2C- und E-Commerce-Theme optimiert für maximale mobile Conversion Rates.",
    namePattern: /shrine/i,
  },
];

export const APP_SIGNATURES: { name: string; category: string; website?: string; pattern: RegExp }[] = [
  { name: "Klaviyo", category: "E-Mail & Marketing Automation", website: "https://klaviyo.com", pattern: /klaviyo\.com|static\.klaviyo/i },
  { name: "Judge.me", category: "Produktbewertungen", website: "https://judge.me", pattern: /cdn\.judge\.me|judgeme/i },
  { name: "Loox", category: "Foto-Bewertungen", website: "https://loox.io", pattern: /loox\.io|loox-v2/i },
  { name: "Yotpo", category: "Reviews & Loyalty", website: "https://yotpo.com", pattern: /staticw2\.yotpo\.com|yotpo/i },
  { name: "Gorgias", category: "Customer Service Helpdesk", website: "https://gorgias.com", pattern: /config\.gorgias\.chat|gorgias/i },
  { name: "Recharge", category: "Abonnements & Subscriptions", website: "https://rechargepayments.com", pattern: /rechargepayments\.com|recharge/i },
  { name: "Procware", category: "Sourcing & Fulfillment", website: "https://procware.de", pattern: /procware|ltp-ludwig/i },
  { name: "Usercentrics", category: "Cookie Consent & DSGVO", website: "https://usercentrics.com", pattern: /app\.usercentrics\.eu/i },
  { name: "Cookiebot", category: "Cookie Consent", website: "https://cookiebot.com", pattern: /consent\.cookiebot\.com/i },
  { name: "Tidio", category: "Live-Chat & Chatbots", website: "https://tidio.com", pattern: /code\.tidio\.co/i },
  { name: "Meta Pixel", category: "Tracking & Social Ads", pattern: /connect\.facebook\.net\/en_US\/fbevents\.js|fbq\(/i },
  { name: "TikTok Pixel", category: "Tracking & Social Ads", pattern: /analytics\.tiktok\.com|ttq\.load/i },
  { name: "Google Tag Manager", category: "Analytics & Tagging", pattern: /googletagmanager\.com\/gtm\.js/i },
  { name: "Pinterest Tag", category: "Tracking & Social Ads", pattern: /s\.pinimg\.com\/ct\/core\.js/i },
  { name: "Rebuy Engine", category: "AI Upselling & Merchandising", website: "https://rebuyengine.com", pattern: /rebuyengine\.com/i },
  { name: "Hotjar", category: "Heatmaps & Nutzeranalyse", website: "https://hotjar.com", pattern: /static\.hotjar\.com/i },
  { name: "Lucky Orange", category: "Session Recording & Heatmaps", pattern: /luckyorange\.com/i },
  { name: "Zipify Pages / OCU", category: "Landingpages & One-Click Upsells", pattern: /zipify\.com/i },
  { name: "PageFly", category: "Drag-and-Drop Page Builder", website: "https://pagefly.io", pattern: /cdn\.pagefly\.io|pagefly/i },
  { name: "Shogun", category: "Page Builder & Frontend", pattern: /getshogun\.com/i },
  { name: "GemPages", category: "Landing Page Builder", pattern: /gempages\.net/i },
  { name: "Omnisend", category: "E-Mail & SMS Marketing", pattern: /omnisnippet1\.com|omnisend/i },
  { name: "Smile.io", category: "Treueprogramm & Belohnungen", pattern: /smile\.io/i },
];
