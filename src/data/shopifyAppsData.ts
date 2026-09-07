export interface ShopifyAppDefinition {
  id: string;
  name: string;
  category:
    | "Marketing & E-Mail"
    | "Reviews & Social Proof"
    | "Page Builders & Design"
    | "Kundenservice & Chat"
    | "Upselling & Conversion"
    | "Tracking & Analytics"
    | "Abonnements & Subscriptions"
    | "Loyalty & Empfehlungen"
    | "DSGVO & Datenschutz"
    | "Suche & Merchandising"
    | "Sourcing & Logistik";
  website: string;
  shopifyAppStoreUrl?: string;
  description: string;
  pricing: string;
  pattern: RegExp;
  badge?: string;
}

export interface DetectedAppDetail {
  name: string;
  category: string;
  website?: string;
  shopifyAppStoreUrl?: string;
  description: string;
  pricing: string;
  signalFound?: string;
}

export interface AppDetectionResult {
  url: string;
  finalUrl: string;
  domain: string;
  isShopify: boolean;
  alternativePlatform?: string;
  storeName?: string;
  storeFavicon?: string;
  ogImage?: string;
  description?: string;
  detectedApps: DetectedAppDetail[];
  categoryCounts: Record<string, number>;
  totalAppsCount: number;
  themeSnippet?: {
    name: string;
    isCustom: boolean;
  };
  checkedAt: string;
  detectionSignals: string[];
}

export const SHOPIFY_APPS_CATALOG: ShopifyAppDefinition[] = [
  // 1. Marketing & E-Mail / SMS
  {
    id: "klaviyo",
    name: "Klaviyo",
    category: "Marketing & E-Mail",
    website: "https://klaviyo.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/klaviyo-email-marketing",
    description: "Der weltweite Goldstandard für E-Mail- und SMS-Marketing Automation im E-Commerce.",
    pricing: "Freemium / ab 20$/Monat",
    pattern: /klaviyo\.com|static\.klaviyo|_learnq|klaviyo-form/i,
  },
  {
    id: "omnisend",
    name: "Omnisend",
    category: "Marketing & E-Mail",
    website: "https://omnisend.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/omnisend",
    description: "Beliebte E-Mail & SMS Marketingplattform mit Fokus auf verhaltensbasierte Workflows.",
    pricing: "Freemium / ab 16$/Monat",
    pattern: /omnisnippet1\.com|omnisend\.com|omnisend/i,
  },
  {
    id: "postscript",
    name: "Postscript SMS",
    category: "Marketing & E-Mail",
    website: "https://postscript.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/postscript-sms-marketing",
    description: "Führende SMS-Marketing-Lösung für Shopify-Shops mit hoher Zustell- und Klickrate.",
    pricing: "ab 35$/Monat",
    pattern: /postscript\.io|sdk\.postscript/i,
  },
  {
    id: "attentive",
    name: "Attentive SMS",
    category: "Marketing & E-Mail",
    website: "https://attentive.com",
    description: "Enterprise-SMS- und Conversational-Commerce-Plattform für rasant wachsende D2C-Brands.",
    pricing: "Individuell",
    pattern: /attentivemobile\.com|tag\.attentive/i,
  },
  {
    id: "privy",
    name: "Privy",
    category: "Marketing & E-Mail",
    website: "https://privy.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/privy",
    description: "Umsatzfördernde Popups, Spin-to-Win-Räder und Newsletter-Anmeldeformulare.",
    pricing: "Freemium / ab 30$/Monat",
    pattern: /widget\.privy\.com|privy\.js/i,
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "Marketing & E-Mail",
    website: "https://mailchimp.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/mailchimp",
    description: "Bekannte All-in-One E-Mail-Marketing Plattform mit Shopify-Synchronisierung.",
    pricing: "Freemium / ab 13$/Monat",
    pattern: /chimpstatic\.com|mailchimp/i,
  },

  // 2. Reviews & Social Proof
  {
    id: "judgeme",
    name: "Judge.me",
    category: "Reviews & Social Proof",
    website: "https://judge.me",
    shopifyAppStoreUrl: "https://apps.shopify.com/judgeme",
    description: "Extrem schnelles und DSGVO-konformes Bewertungs-Tool mit Foto- und Video-Reviews.",
    pricing: "Kostenlos / Awesome: 15$/Monat",
    pattern: /cdn\.judge\.me|judgeme|jdgm-widget/i,
  },
  {
    id: "loox",
    name: "Loox",
    category: "Reviews & Social Proof",
    website: "https://loox.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/loox",
    description: "Visuelle Foto- und Video-Kundenbewertungen mit automatischen Empfehlungsrabatten.",
    pricing: "ab 9,99$/Monat",
    pattern: /loox\.io|loox-v2|loox-rating/i,
  },
  {
    id: "yotpo",
    name: "Yotpo Reviews",
    category: "Reviews & Social Proof",
    website: "https://yotpo.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/yotpo-social-reviews",
    description: "Umfassende Enterprise-Plattform für Bewertungen, UGC und visuelles Marketing.",
    pricing: "Freemium / ab 15$/Monat",
    pattern: /staticw2\.yotpo\.com|yotpo-widget/i,
  },
  {
    id: "okendo",
    name: "Okendo",
    category: "Reviews & Social Proof",
    website: "https://okendo.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/okendo-reviews",
    description: "High-End Bewertungs- und Zero-Party-Data Plattform für Shopify Plus Händler.",
    pricing: "ab 19$/Monat",
    pattern: /okendo\.io|cdn\.okendo\.io/i,
  },
  {
    id: "stamped",
    name: "Stamped.io",
    category: "Reviews & Social Proof",
    website: "https://stamped.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/stamped-io",
    description: "Kombiniertes System für Produktbewertungen, Net Promoter Score und Loyalty.",
    pricing: "Freemium / ab 23$/Monat",
    pattern: /stamped\.io|cdn1\.stamped\.io/i,
  },
  {
    id: "trustpilot",
    name: "Trustpilot",
    category: "Reviews & Social Proof",
    website: "https://trustpilot.com",
    description: "Weltweit vertrauenswürdiges Bewertungssiegel mit TrustBox-Widgets.",
    pricing: "Freemium / Enterprise",
    pattern: /widget\.trustpilot\.com|trustbox/i,
  },

  // 3. Page Builders & Visual Layouts
  {
    id: "pagefly",
    name: "PageFly",
    category: "Page Builders & Design",
    website: "https://pagefly.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/pagefly",
    description: "Führender Drag-and-Drop Page Builder für individuelle Produkt- und Landingpages.",
    pricing: "Freemium / ab 24$/Monat",
    pattern: /cdn\.pagefly\.io|pagefly-main|pagefly/i,
  },
  {
    id: "gempages",
    name: "GemPages",
    category: "Page Builders & Design",
    website: "https://gempages.net",
    shopifyAppStoreUrl: "https://apps.shopify.com/gempages",
    description: "Intuitiver Landingpage-Builder mit KI-Layout-Generator und schnellen Ladezeiten.",
    pricing: "Freemium / ab 29$/Monat",
    pattern: /gempages\.net|gem-container/i,
  },
  {
    id: "shogun",
    name: "Shogun Page Builder",
    category: "Page Builders & Design",
    website: "https://getshogun.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/shogun",
    description: "Leistungsstarker visueller Editor für Produktseiten und Blog-Layouts.",
    pricing: "ab 39$/Monat",
    pattern: /getshogun\.com|shogun-image/i,
  },
  {
    id: "zipify",
    name: "Zipify Pages",
    category: "Page Builders & Design",
    website: "https://zipify.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/zipifypages",
    description: "Von E-Commerce-Veteran Ezra Firestone entwickelte hochkonvertierende Landingpage-App.",
    pricing: "ab 67$/Monat",
    pattern: /zipify\.com|zipifypages/i,
  },

  // 4. Kundenservice & Helpdesk / Live Chat
  {
    id: "gorgias",
    name: "Gorgias",
    category: "Kundenservice & Chat",
    website: "https://gorgias.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/gorgias",
    description: "Der Nr. 1 Helpdesk für Shopify-Shops mit direkter Anbindung an Bestell- und Bestandsdaten.",
    pricing: "ab 50$/Monat",
    pattern: /config\.gorgias\.chat|gorgias-chat|gorgias/i,
  },
  {
    id: "tidio",
    name: "Tidio Live-Chat & AI",
    category: "Kundenservice & Chat",
    website: "https://tidio.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/tidio-chat",
    description: "Beliebter Live-Chat mit integrierten KI-Chatbots für Lead-Generierung und Kundenbetreuung.",
    pricing: "Freemium / ab 29$/Monat",
    pattern: /code\.tidio\.co|tidio-chat/i,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "Kundenservice & Chat",
    website: "https://zendesk.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/zendesk",
    description: "Weltweiter Enterprise Helpdesk für Omnichannel-Support über E-Mail, Chat und Telefon.",
    pricing: "ab 55$/Monat",
    pattern: /static\.zdassets\.com|ekr\.zdassets\.com/i,
  },
  {
    id: "crisp",
    name: "Crisp Chat",
    category: "Kundenservice & Chat",
    website: "https://crisp.chat",
    shopifyAppStoreUrl: "https://apps.shopify.com/crisp",
    description: "Schlanker, moderner Live-Chat mit CRM-Funktion und Knowledge Base.",
    pricing: "Freemium / ab 25$/Monat",
    pattern: /client\.crisp\.chat/i,
  },

  // 5. Upselling, Cross-Selling & Conversion
  {
    id: "rebuy",
    name: "Rebuy Engine",
    category: "Upselling & Conversion",
    website: "https://rebuyengine.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/rebuy-engine",
    description: "KI-gestützte personalisierte Produktempfehlungen, intelligente Warenkörbe und Post-Purchase Upsells.",
    pricing: "ab 99$/Monat",
    pattern: /rebuyengine\.com|rebuy\.cdn/i,
  },
  {
    id: "reconvert",
    name: "ReConvert Upsell",
    category: "Upselling & Conversion",
    website: "https://reconvert.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/reconvert-post-purchase-upsell",
    description: "Umsatzsteigerung durch Danke-Seiten-Anpassung, Umfragen und One-Click Post-Purchase Upsells.",
    pricing: "Freemium / ab 4,99$/Monat",
    pattern: /reconvert\.com|cdn\.reconvert/i,
  },
  {
    id: "fbt",
    name: "Frequently Bought Together",
    category: "Upselling & Conversion",
    website: "https://codeblackbelt.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/frequently-bought-together",
    description: "Der bewährte Amazon-Style Bundle- und Rabatt-Block für Shopify Produktseiten.",
    pricing: "9,99$/Monat",
    pattern: /codeblackbelt\.com|cbb-frequently-bought/i,
  },
  {
    id: "zipify_ocu",
    name: "OneClickUpsell (OCU)",
    category: "Upselling & Conversion",
    website: "https://zipify.com/apps/ocu/",
    shopifyAppStoreUrl: "https://apps.shopify.com/oneclickupsell",
    description: "Post-Purchase und In-Cart Upselling ohne wiederholte Eingabe der Bezahldaten.",
    pricing: "ab 35$/Monat",
    pattern: /ocu\.zipify\.com/i,
  },

  // 6. Tracking, Analytics & Social Ads
  {
    id: "meta_pixel",
    name: "Meta Pixel (Facebook & IG)",
    category: "Tracking & Analytics",
    website: "https://business.facebook.com",
    description: "Offizielles Tracking-Pixel für Facebook und Instagram Werbekampagnen und Conversion API.",
    pricing: "Kostenlos",
    pattern: /connect\.facebook\.net\/en_US\/fbevents\.js|fbq\(/i,
  },
  {
    id: "tiktok_pixel",
    name: "TikTok Pixel",
    category: "Tracking & Analytics",
    website: "https://ads.tiktok.com",
    description: "Erfasst Nutzerinteraktionen und Events für hochrentable TikTok Werbeanzeigen.",
    pricing: "Kostenlos",
    pattern: /analytics\.tiktok\.com|ttq\.load/i,
  },
  {
    id: "gtm",
    name: "Google Tag Manager / GA4",
    category: "Tracking & Analytics",
    website: "https://tagmanager.google.com",
    description: "Zentrales Tagging-System für Google Analytics 4, Ads Conversion Tracking und Remarketing.",
    pricing: "Kostenlos",
    pattern: /googletagmanager\.com\/gtm\.js|google-analytics\.com\/analytics\.js/i,
  },
  {
    id: "pinterest_tag",
    name: "Pinterest Tag",
    category: "Tracking & Analytics",
    website: "https://ads.pinterest.com",
    description: "Tracking-Code für Pinterest Shopping-Ads und Lifestyle-Conversions.",
    pricing: "Kostenlos",
    pattern: /s\.pinimg\.com\/ct\/core\.js|pintrk/i,
  },
  {
    id: "hotjar",
    name: "Hotjar",
    category: "Tracking & Analytics",
    website: "https://hotjar.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/hotjar-tracking",
    description: "Heatmaps, Conversion-Funnel-Analysen und Aufzeichnungen des echten Nutzerverhaltens.",
    pricing: "Freemium / ab 32$/Monat",
    pattern: /static\.hotjar\.com|_hjSettings/i,
  },
  {
    id: "clarity",
    name: "Microsoft Clarity",
    category: "Tracking & Analytics",
    website: "https://clarity.microsoft.com",
    description: "Kostenloses Heatmap- und Session-Recording-Tool ohne Traffic-Limits.",
    pricing: "100% Kostenlos",
    pattern: /clarity\.ms\/tag/i,
  },
  {
    id: "luckyorange",
    name: "Lucky Orange",
    category: "Tracking & Analytics",
    website: "https://luckyorange.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/lucky-orange",
    description: "Session-Recordings, dynamische Heatmaps und Live-Besucherüberwachung.",
    pricing: "Freemium / ab 18$/Monat",
    pattern: /luckyorange\.com|upload\.luckyorange/i,
  },

  // 7. Abonnements & Subscriptions
  {
    id: "recharge",
    name: "Recharge Payments",
    category: "Abonnements & Subscriptions",
    website: "https://rechargepayments.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/subscription-payments",
    description: "Weltmarktführer für wiederkehrende Zahlungen, Abo-Boxen und Mitgliedschaften auf Shopify.",
    pricing: "ab 99$/Monat + 1,25%",
    pattern: /rechargepayments\.com|recharge-subscription|recharge/i,
  },
  {
    id: "appstle",
    name: "Appstle Subscriptions",
    category: "Abonnements & Subscriptions",
    website: "https://appstle.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/appstle-subscriptions",
    description: "Stark wachsende Abo-App mit geringen Transaktionsgebühren und flexiblen Intervallen.",
    pricing: "Freemium / ab 10$/Monat",
    pattern: /appstle\.com|appstle-subscription/i,
  },
  {
    id: "bold_sub",
    name: "Bold Subscriptions",
    category: "Abonnements & Subscriptions",
    website: "https://boldcommerce.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/bold-subscriptions",
    description: "Skalierbare Abo-Infrastruktur für etablierte Marken mit Kundenportal.",
    pricing: "ab 49,99$/Monat",
    pattern: /boldcommerce\.com|bold-subscriptions/i,
  },

  // 8. Loyalty & Empfehlungen
  {
    id: "smile",
    name: "Smile.io",
    category: "Loyalty & Empfehlungen",
    website: "https://smile.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/smile-io",
    description: "Die beliebteste App für Treuepunkte, VIP-Stufen und Weiterempfehlungs-Belohnungen.",
    pricing: "Freemium / ab 49$/Monat",
    pattern: /smile\.io|sweettooth/i,
  },
  {
    id: "yotpo_loyalty",
    name: "Yotpo Loyalty (Swell)",
    category: "Loyalty & Empfehlungen",
    website: "https://yotpo.com/loyalty",
    shopifyAppStoreUrl: "https://apps.shopify.com/yotpo-loyalty",
    description: "Umfangreiches Loyalty-Programm zur Steigerung des Kunden-Lifetime-Values (CLV).",
    pricing: "Individuell / ab 29$/Monat",
    pattern: /swellrewards\.com|yotpo-loyalty/i,
  },
  {
    id: "referralcandy",
    name: "ReferralCandy",
    category: "Loyalty & Empfehlungen",
    website: "https://referralcandy.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/referralcandy",
    description: "Automatisiertes Empfehlungsmarketing (Freunde werben Freunde) für Shopify Shops.",
    pricing: "ab 59$/Monat",
    pattern: /referralcandy\.com/i,
  },

  // 9. DSGVO, Cookie-Consent & Recht
  {
    id: "usercentrics",
    name: "Usercentrics Consent",
    category: "DSGVO & Datenschutz",
    website: "https://usercentrics.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/usercentrics-cmp",
    description: "Rechtssicheres Enterprise Consent Management für den europäischen Markt.",
    pricing: "ab 6$/Monat",
    pattern: /app\.usercentrics\.eu|usercentrics/i,
  },
  {
    id: "cookiebot",
    name: "Cookiebot CMP",
    category: "DSGVO & Datenschutz",
    website: "https://cookiebot.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/cookiebot",
    description: "Automatisierter Cookie-Scan und rechtskonforme Cookie-Banner für DSGVO und ePrivacy.",
    pricing: "Freemium / ab 12$/Monat",
    pattern: /consent\.cookiebot\.com|cookiebot/i,
  },
  {
    id: "pandectes",
    name: "Pandectes GDPR Compliance",
    category: "DSGVO & Datenschutz",
    website: "https://pandectes.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/pandectes-gdpr",
    description: "Sehr verbreitete DSGVO-Banner-App mit Google Consent Mode v2 Unterstützung.",
    pricing: "Freemium / ab 9$/Monat",
    pattern: /pandectes\.io|pnd-gdpr|pandectes|gdpr-cookie-consent/i,
  },

  // 10. Modern App Embed Extensions & Conversion Tools
  {
    id: "kaching_bundles",
    name: "Kaching Bundles",
    category: "Upselling & Conversion",
    website: "https://kaching.co",
    shopifyAppStoreUrl: "https://apps.shopify.com/kaching-bundle-quantity-breaks",
    description: "Erhöht den durchschnittlichen Bestellwert (AOV) durch intuitive Mengenrabatte und Bundle-Deals.",
    pricing: "ab 9.99$/Monat",
    pattern: /kaching-bundles|kaching_bundles/i,
  },
  {
    id: "kaching_cart",
    name: "Kaching Cart Drawer",
    category: "Upselling & Conversion",
    website: "https://kaching.co",
    shopifyAppStoreUrl: "https://apps.shopify.com/kaching-cart",
    description: "Interaktiver Slide-out Warenkorb mit integrierten 1-Click Upsells, Free-Shipping Bar und Express Checkout.",
    pricing: "ab 9.99$/Monat",
    pattern: /kaching-cart|kaching_cart/i,
  },
  {
    id: "tabs_studio",
    name: "Tabs Studio",
    category: "Page Builders & Design",
    website: "https://apps.shopify.com/tabs-studio",
    shopifyAppStoreUrl: "https://apps.shopify.com/tabs-studio",
    description: "Erstellt saubere Produktbeschreibungs-Tabs und Akkordeons für bessere Übersicht und Conversion.",
    pricing: "Freemium / ab 3.99$/Monat",
    pattern: /tabs-studio|tabs_studio/i,
  },
  {
    id: "stape_tracking",
    name: "Stape.io Server-Side Tracking",
    category: "Tracking & Analytics",
    website: "https://stape.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/stape-server-side-tracking",
    description: "Server-Side Google Tag Manager & Meta CAPI Tracking für 100% verlässliche Conversion-Attribution ohne Adblocker-Verlust.",
    pricing: "ab 20$/Monat",
    pattern: /stape-remix|stape\.io|STAPE\.IO/i,
  },
  {
    id: "applovin",
    name: "AppLovin E-Commerce Integration",
    category: "Marketing & E-Mail",
    website: "https://applovin.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/applovin-integration",
    description: "Offizielle Werbenetzwerk- und Dynamic Product Ads Integration für mobile Kampagnen.",
    pricing: "Kostenlos installierbar",
    pattern: /applovin-shop-integration|applovin/i,
  },
  {
    id: "symprosys",
    name: "Symprosys Google Shopping Feed",
    category: "Marketing & E-Mail",
    website: "https://symprosys.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/google-shopping-feed",
    description: "Führende App zur automatischen Feedsynchronisation für Google Shopping, Microsoft Ads und Meta.",
    pricing: "ab 4.99$/Monat",
    pattern: /symprosys|symprosys_feed/i,
  },
  {
    id: "redtrack",
    name: "RedTrack Media Attribution",
    category: "Tracking & Analytics",
    website: "https://redtrack.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/redtrack",
    description: "Server-to-Server Conversion Tracking und Multi-Touch Attribution für Medienkäufer und E-Commerce Brands.",
    pricing: "ab 149$/Monat",
    pattern: /redtrack|redhash|redcmps|rtkclickid/i,
  },
  {
    id: "voluum",
    name: "Voluum / ClickFlare Ad Tracker",
    category: "Tracking & Analytics",
    website: "https://voluum.com",
    shopifyAppStoreUrl: "https://voluum.com",
    description: "Leistungsstarkes Performance-Tracking für Paid Traffic Kampagnen und Affiliate-Attribution.",
    pricing: "ab 199$/Monat",
    pattern: /uniclick\.js|voluumDomain|voluum/i,
  },
  {
    id: "adcell",
    name: "ADCELL Affiliate Netzwerk",
    category: "Marketing & E-Mail",
    website: "https://adcell.de",
    shopifyAppStoreUrl: "https://apps.shopify.com/adcell-tracking",
    description: "Affiliate-Marketing Tracking für das reichweitenstarke ADCELL Partnerprogramm im DACH-Raum.",
    pricing: "Performance-basiert",
    pattern: /adcell_vcad|adcell/i,
  },
  {
    id: "criteo",
    name: "Criteo Dynamic Retargeting",
    category: "Marketing & E-Mail",
    website: "https://criteo.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/criteo",
    description: "Automatisierte dynamische Retargeting-Banner und personalisierte Produktempfehlungen im Web.",
    pricing: "Pay-per-Click",
    pattern: /criteo|cto_bundle|5829751/i,
  },
  {
    id: "tiktok_pixel",
    name: "TikTok Pixel & Sales Channel",
    category: "Marketing & E-Mail",
    website: "https://tiktok.com/business",
    shopifyAppStoreUrl: "https://apps.shopify.com/tiktok",
    description: "Offizielle TikTok-Integration für Events API, Pixel-Tracking und In-App Shopping Kataloge.",
    pricing: "Kostenlos",
    pattern: /_ttp|ttcsid|2753413|analytics\.tiktok\.com/i,
  },
  {
    id: "pinterest_tag",
    name: "Pinterest Tag & Shopping",
    category: "Marketing & E-Mail",
    website: "https://pinterest.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/pinterest",
    description: "Offizieller Pinterest Tag zur Erfassung von Kaufabschlüssen und dynamischem Retargeting.",
    pricing: "Kostenlos",
    pattern: /_pin_unauth|3009811|pintrk/i,
  },
  {
    id: "meta_pixel",
    name: "Meta Pixel (Facebook Ads)",
    category: "Marketing & E-Mail",
    website: "https://facebook.com/business",
    shopifyAppStoreUrl: "https://apps.shopify.com/facebook",
    description: "Offizielles Meta Tracking für Facebook & Instagram Ads zur Zielgruppenbildung und Conversion-Messung.",
    pricing: "Kostenlos",
    pattern: /_fbp|2556259|connect\.facebook\.net/i,
  },
  {
    id: "snapchat_pixel",
    name: "Snapchat Pixel",
    category: "Marketing & E-Mail",
    website: "https://forbusiness.snapchat.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/snapchat-ads",
    description: "Erfasst Conversions aus Snapchat Kampagnen für Zielgruppenoptimierung.",
    pricing: "Kostenlos",
    pattern: /_scid|_scida|_ScCbts|sc-static\.net/i,
  },
  {
    id: "google_tag_manager",
    name: "Google Analytics 4 & Tag Manager",
    category: "Tracking & Analytics",
    website: "https://marketingplatform.google.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/google",
    description: "Offizielles Google Tracking für E-Commerce Conversions, Enhanced Ecommerce und GA4 Messungen.",
    pricing: "Kostenlos",
    pattern: /Google Analytics tag \(migrated\)|_gtmeec|_gcl_|googletagmanager\.com|google-analytics\.com|1558137/i,
  },
  {
    id: "shop_pay",
    name: "Shop Pay & Accelerated Checkout",
    category: "Upselling & Conversion",
    website: "https://shopify.com/shop-pay",
    description: "Shopifys nativer 1-Click Express Checkout mit bis zu 50% höherer mobiler Conversion-Rate.",
    pricing: "Inklusive in Shopify",
    pattern: /portable-wallets|shopify_pay_accelerated|shop_pay|shopify_pay/i,
  },
  {
    id: "klarna_onsite",
    name: "Klarna On-Site Messaging",
    category: "Upselling & Conversion",
    website: "https://klarna.com",
    shopifyAppStoreUrl: "https://apps.shopify.com/klarna-on-site-messaging",
    description: "Bietet flexible Zahlungsoptionen wie 'Rechnung in 30 Tagen' oder Ratenkauf direkt auf Produktseiten an.",
    pricing: "Inklusive in Klarna",
    pattern: /klarna-osm|klarna/i,
  },
  {
    id: "paypal_express",
    name: "PayPal Express & PayLater",
    category: "Upselling & Conversion",
    website: "https://paypal.com",
    description: "Weltweiter Express-Checkout und flexible Ratenkauf-Hinweise direkt im Warenkorb.",
    pricing: "Transaktionsbasiert",
    pattern: /paypal-button|paypalobjects\.com|paypal/i,
  },

  // 11. Suche & Merchandising
  {
    id: "searchanise",
    name: "Searchanise Search & Filters",
    category: "Suche & Merchandising",
    website: "https://searchanise.io",
    shopifyAppStoreUrl: "https://apps.shopify.com/searchanise",
    description: "Intelligente Autovervollständigung, facettierte Filter und sofortige Suchergebnisse.",
    pricing: "Freemium / ab 19$/Monat",
    pattern: /searchanise\.com|snize/i,
  },
  {
    id: "boost_commerce",
    name: "Boost AI Search & Discovery",
    category: "Suche & Merchandising",
    website: "https://boostcommerce.net",
    shopifyAppStoreUrl: "https://apps.shopify.com/product-filter-search",
    description: "KI-gestützte Produktsuche, dynamische Filter und Visual Merchandising für große Kataloge.",
    pricing: "ab 19$/Monat",
    pattern: /boostcommerce\.net|boost-pfs/i,
  },

  // 11. Sourcing, Logistik & Fulfillment
  {
    id: "procware",
    name: "Procware Fulfillment & Sourcing",
    category: "Sourcing & Logistik",
    website: "https://procware.de",
    description: "End-to-End Beschaffung, Qualitätsprüfung in China und Direktexport für skalierende Shopify Brands.",
    pricing: "Kostenlose Erstberatung",
    pattern: /procware|ltp-ludwig/i,
  },
];
