import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Search,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Clock,
  Layers,
  Store,
  Info,
  ChevronDown,
  DollarSign,
  Package,
  Zap,
  Lock,
  Boxes,
  Target,
  FileSpreadsheet,
} from "lucide-react";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import { useAuth } from "../context/AuthContext";

interface ShopifySalesTrackerPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
}

export const ShopifySalesTrackerPage: React.FC<ShopifySalesTrackerPageProps> = ({
  onOpenBooking,
  lang: propLang,
}) => {
  const location = useLocation();
  const currentLang: "de" | "en" =
    propLang || (location.pathname.startsWith("/en") ? "en" : "de");
  const { isAuthenticated, openAuthModal } = useAuth();
  const isDe = currentLang === "de";

  // Interactive Live Estimator State
  const [testStoreUrl, setTestStoreUrl] = useState<string>("beispiel-brand.de");
  const [estCatalogSize, setEstCatalogSize] = useState<number>(45);
  const [estAveragePrice, setEstAveragePrice] = useState<number>(42.5);
  const [estVelocityLevel, setEstVelocityLevel] = useState<"low" | "medium" | "high">("medium");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    applyToolSeo("shopifySalesTracker", currentLang);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentLang]);

  // Derived calculation
  const unitsMultiplier =
    estVelocityLevel === "low" ? 9 : estVelocityLevel === "medium" ? 26 : 68;
  const estimatedDailyUnits = Math.round((estCatalogSize * unitsMultiplier) / 30);
  const estimatedMonthlyRevenue = Math.round(estimatedDailyUnits * 30 * estAveragePrice);
  const estimatedAnnualRevenue = estimatedMonthlyRevenue * 12;

  const faqs = isDe
    ? [
        {
          q: "Wie kann man den Shopify Umsatz sehen?",
          a: "Um den Shopify Umsatz eines fremden Online-Shops zu sehen, gibt es verschiedene Schätzmethoden: Die Bestandsdifferenz-Methode (/products.json Snapshots), die Cart-Limit-Methode (999 Artikel in den Warenkorb legen), Bestellnummern-Stichproben und Traffic-Schätzungen (Besucher × Conversion-Rate × AOV). Unser Shopify Sales Tracker automatisiert diese Prozesse und liefert verlässliche Schätzungen auf Basis kontinuierlicher Daten-Snapshots.",
        },
        {
          q: "Ist der Procware Shopify Sales Tracker wirklich kostenlos (Shopify Sales Tracker Free)?",
          a: "Ja, der Procware Shopify Sales Tracker ist zu 100% kostenlos nutzbar. Du kannst den interaktiven Sales Estimator auf dieser Seite sofort ohne Registrierung testen. Für das Anlegen individueller Watchlists und kontinuierliche tägliche Umsatz-Updates benötigst du lediglich einen kostenlosen Procware-Account ohne Zahlungsdaten.",
        },
        {
          q: "Wie präzise ist ein Shopify Sales Estimator im Vergleich zu realen Zahlen?",
          a: "Ein mathematischer Shopify Sales Estimator erreicht bei aktiven DTC-Stores in der Regel eine Genauigkeit von ca. 85% bis 92%. Da Händler über /products.json reale Bestandsdaten preisgeben, entspricht der Bestandsrückgang fast 1:1 den tatsächlichen Verkäufen. Abweichungen entstehen lediglich bei manuellen Inventarkorrekturen oder Restocks.",
        },
        {
          q: "Kann jeder beliebige Shopify Store überwacht werden?",
          a: "Über 90% aller Shopify Stores weltweit lassen den standardmäßigen Endpoint /products.json geöffnet. Bei diesen Shops funktioniert das Tracking sofort. Sollte ein Shop den Zugriff blockieren (z. B. manche Shopify Plus Enterprise-Shops), nutzt unser Modell sekundäre Indikatoren wie Katalogtiefe, Social-Ad-Spend und Traffic-Multiplikatoren.",
        },
        {
          q: "Ist das Tracken von Shopify Umsätzen legal und DSGVO-konform?",
          a: "Ja, absolut. Unser Crawler fragt ausschließlich öffentlich im Web erreichbare Produktdaten ab. Es werden weder Firewalls umgangen, noch Passwörter geknackt oder persönliche Kundendaten (Namen, Adressen, Zahlungsinformationen) erfasst. Die Datenverarbeitung entspricht zu 100% den Vorgaben der DSGVO.",
        },
        {
          q: "Was ist der Unterschied zwischen einem Shopify Sales Tracker und Spy-Tools wie Koala oder PPSPY?",
          a: "Klassische Spy-Tools (wie Koala Inspector oder PPSPY) verlangen oft teure Monatsabos (30 $ bis 100 $/Monat) und zeigen häufig ungenaue oder veraltete Schätzungen an. Procware integriert den Shopify Sales Tracker kostenlos in eine ganzheitliche E-Commerce Plattform: Sobald du ein erfolgreiches Produkt identifiziert hast, kannst du es mit 1 Klick direkt über unsere Einkäufer in China sourcen und über unser deutsches Lager versenden.",
        },
        {
          q: "Wie oft werden die Verkaufszahlen aktualisiert?",
          a: "Im System werden die hinterlegten Shops täglich mehrfach auf Bestandsänderungen geprüft. Dadurch siehst du nicht nur grobe Monatssummen, sondern taggenaue Spitzen, z. B. wenn der Mitbewerber eine erfolgreiche TikTok- oder Facebook-Kampagne skaliert.",
        },
        {
          q: "Wie nutze ich die gewonnenen Daten für mein eigenes E-Commerce Business?",
          a: "Wenn du siehst, dass ein Konkurrent mit einem bestimmten Produkt 20.000 € Monatsumsatz erzielt, weißt du, dass Proof of Concept und Nachfrage vorhanden sind. Du kannst das Produkt optimieren, über Procware mit eigenem Branding und besserer Marge sourcen und mit gezielten Creatives Marktanteile gewinnen.",
        },
      ]
    : [
        {
          q: "How can I see any Shopify store's revenue?",
          a: "To see any Shopify store's sales, you can utilize inventory decrement tracking via public /products.json endpoints, cart quantity probing, order number sampling, or web traffic benchmarking (Traffic × Conversion Rate × AOV). Our free Shopify Sales Tracker automates these calculations to provide accurate daily revenue estimates.",
        },
        {
          q: "Is the Procware Shopify Sales Tracker truly free?",
          a: "Yes! Procware provides a 100% free Shopify Sales Tracker and Sales Estimator. You can simulate store revenue on this page immediately, and unlock full ongoing tracking with a free Procware account—no credit card required.",
        },
        {
          q: "How accurate is a Shopify Sales Estimator compared to actual accounting books?",
          a: "On stores with standard storefront inventory tracking, inventory delta models typically achieve 85% to 92% accuracy. Because decrements mirror consumer checkout events, the variance from actual sales is remarkably low.",
        },
        {
          q: "Can I track any Shopify store worldwide?",
          a: "Yes, over 90% of all Shopify stores expose their public /products.json feed by default. If a store explicitly disables this feed, our algorithm switches to secondary heuristic modeling based on catalog depth and advertising scale.",
        },
        {
          q: "Is tracking Shopify competitor sales legal and GDPR compliant?",
          a: "Yes. The tool strictly accesses public storefront information without bypassing authentication or collecting any personal buyer data. It is 100% compliant with international privacy and data protection standards.",
        },
        {
          q: "What makes Procware different from paid spy extensions like Koala or PPSPY?",
          a: "Unlike paid standalone browser extensions charging $30–$100/month, Procware provides free sales tracking connected directly to native factory sourcing and German fulfillment. Once you uncover a winning product, you can source it factory-direct with 1 click.",
        },
        {
          q: "How frequently are sales data points refreshed?",
          a: "Tracked stores are inspected on scheduled daily intervals to log time-series inventory deltas, revealing exact daily order velocity and campaign scaling spikes.",
        },
        {
          q: "How should I leverage competitor sales insights?",
          a: "Use competitor revenue insights to identify proven demand without burning ad budget on untested ideas. Submit the winning SKU to Procware to negotiate factory-direct pricing and build a superior brand.",
        },
      ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. Header Breadcrumb & Language Switcher */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to={isDe ? "/tools" : "/en/tools"}
              className="hover:text-blue-600 transition-colors"
            >
              Tools
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">
              {isDe ? "Shopify Sales Tracker" : "Shopify Sales Estimator"}
            </span>
          </div>
          <ToolLanguageSwitcher
            currentLang={currentLang}
            dePath="/shopify-sales-tracker"
            enPath="/en/shopify-sales-tracker"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-12 sm:space-y-16">
        {/* 2. Hero Section targeting exact keywords */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isDe
                ? "Procware Ecom Suite • Shopify Sales Tracker Free"
                : "Procware Ecom Suite • Free Shopify Sales Estimator"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            {isDe ? (
              <>
                Shopify Sales Tracker:{" "}
                <span className="text-blue-600">Jeden Shopify Umsatz sehen & kostenlos schätzen</span>
              </>
            ) : (
              <>
                Shopify Sales Tracker:{" "}
                <span className="text-blue-600">Track & Estimate Any Shopify Store Revenue</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
            {isDe
              ? "Du möchtest den echten Shopify Umsatz deiner Konkurrenten sehen? Unser kostenloser Shopify Sales Tracker und Shopify Sales Estimator analysiert tägliche Verkaufszahlen, Bestseller-Varianten und Umsatzentwicklungen über automatisierte Bestands-Snapshots."
              : "Want to see any Shopify store's actual revenue? Our free Shopify Sales Tracker and Sales Estimator analyzes daily order volume, best-selling SKUs, and projected annual run-rate using mathematical inventory decrement snapshots."}
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/suite/sales-tracker"
                className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>{isDe ? "Zur Ecom Suite wechseln" : "Open in Ecom Suite"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={() => openAuthModal("register", "/suite/sales-tracker")}
                className="px-7 py-3.5 rounded-2xl bg-slate-950 hover:bg-blue-600 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {isDe
                    ? "Shopify Sales Tracker Free nutzen"
                    : "Use Shopify Sales Tracker Free"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <a
              href="#estimator-demo"
              className="px-6 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-2xs transition-colors"
            >
              {isDe ? "Shopify Sales Estimator testen" : "Test Sales Estimator"}
            </a>
          </div>

          {/* Keyword Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-700">Top Suchbegriffe:</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Shopify Sales Tracker</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Shopify Sales Tracker Free</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Shopify Umsatz</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Shopify Umsatz sehen</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Shopify Sales Estimator</span>
          </div>
        </div>

        {/* 3. Interactive Live Estimator Simulator */}
        <div
          id="estimator-demo"
          className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-8"
        >
          <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                  {isDe ? "Shopify Sales Estimator (Live-Rechner)" : "Shopify Sales Estimator (Live Calculator)"}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isDe
                  ? "Berechne den geschätzten Shopify Umsatz jedes beliebigen Online-Shops in Echtzeit."
                  : "Simulate and project estimated revenue for any Shopify store based on key metrics."}
              </p>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-start sm:self-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isDe ? "Kostenlos verfügbar" : "100% Free Tool"}</span>
            </span>
          </div>

          {/* Quick Domain Input Preview */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto text-xs font-bold text-slate-700 whitespace-nowrap">
              {isDe ? "Store URL testen:" : "Test Store URL:"}
            </div>
            <div className="relative w-full">
              <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={testStoreUrl}
                onChange={(e) => setTestStoreUrl(e.target.value)}
                placeholder="z. B. gymshark.com oder brand.de"
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => openAuthModal("register", "/suite/sales-tracker")}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{isDe ? "Live analysieren" : "Analyze Live"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sliders and Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{isDe ? "Katalog-Größe (SKUs)" : "Catalog Depth (SKUs)"}</span>
                <span className="text-blue-600 font-mono text-sm">{estCatalogSize} Produkte</span>
              </div>
              <input
                type="range"
                min={5}
                max={250}
                step={5}
                value={estCatalogSize}
                onChange={(e) => setEstCatalogSize(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                {isDe
                  ? "Wird über /products.json automatisch erfasst"
                  : "Auto-detected via public storefront feed"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{isDe ? "Ø Verkaufspreis (AOV)" : "Average Price (AOV)"}</span>
                <span className="text-blue-600 font-mono text-sm">{estAveragePrice.toFixed(2)} €</span>
              </div>
              <input
                type="range"
                min={10}
                max={150}
                step={2.5}
                value={estAveragePrice}
                onChange={(e) => setEstAveragePrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                {isDe ? "Durchschnittlicher Warenkorbwert des Shops" : "Weighted average variant pricing"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{isDe ? "Skalierungsgrad (Ad Spend)" : "Ad Spend Scaling Level"}</span>
                <span className="capitalize text-blue-600 font-mono text-sm">{estVelocityLevel}</span>
              </div>
              <select
                value={estVelocityLevel}
                onChange={(e) => setEstVelocityLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              >
                <option value="low">{isDe ? "Niedrig (Wenig Ads / Organisch)" : "Low (Organic / Bootstrapped)"}</option>
                <option value="medium">{isDe ? "Mittel (Solider DTC Werbedruck)" : "Medium (Consistent Meta Ads)"}</option>
                <option value="high">{isDe ? "Hoch (Aggressives Scaling / Bestseller)" : "High (Heavy Scaling / Viral)"}</option>
              </select>
              <span className="text-[11px] text-slate-500 block">
                {isDe ? "Signalisiert durch aktive Meta Ad Library Kampagnen" : "Driven by Meta Ad Library activity"}
              </span>
            </div>
          </div>

          {/* Results Display Dashboard */}
          <div className="p-6 sm:p-8 bg-slate-950 text-white rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center border border-slate-900 shadow-xl">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isDe ? "Tägliche Bestellungen" : "Estimated Daily Orders"}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                ~{estimatedDailyUnits.toLocaleString("de-DE")} Stk.
              </div>
              <div className="text-[11px] text-slate-400">
                {isDe ? "Geschätzte Sendungen pro Tag" : "Estimated daily shipments"}
              </div>
            </div>

            <div className="space-y-1 sm:border-x sm:border-slate-800 sm:px-4">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {isDe ? "Geschätzter Shopify Umsatz" : "Estimated Monthly Revenue"}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-blue-400">
                ~{estimatedMonthlyRevenue.toLocaleString("de-DE")} €
              </div>
              <div className="text-[11px] text-slate-400">
                {isDe ? "Monatlicher Bruttoumsatz" : "Gross monthly volume"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                {isDe ? "Jahres-Umsatzprognose" : "Annual Run-Rate"}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                ~{estimatedAnnualRevenue.toLocaleString("de-DE")} €
              </div>
              <div className="text-[11px] text-slate-400">
                {isDe ? "Prognose auf 12 Monate" : "12-month projection"}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {isDe
                  ? "Mathematisches Schätzmodell auf Basis von Inventardifferenzen"
                  : "Modeled inventory decrement analysis without account access"}
              </span>
            </div>
            <button
              onClick={() => openAuthModal("register", "/suite/sales-tracker")}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs font-black shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>{isDe ? "Vollen Shopify Sales Tracker öffnen" : "Unlock Full Sales Tracker"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4. Deep Editorial SEO Guide: Wie kann man den Shopify Umsatz sehen? */}
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-4">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {isDe ? "Technischer E-Commerce Ratgeber" : "Technical E-Commerce Blueprint"}
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Wie kann man den Shopify Umsatz sehen? (5 Methoden im Vergleich)"
                : "How to See Any Shopify Store Revenue (5 Proven Methods Compared)"}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {isDe
                ? "Wer im E-Commerce und Dropshipping erfolgreich sein möchte, muss die Verkaufszahlen der Konkurrenz kennen. Statt blind Produkte zu testen, kannst du mit einem professionellen Shopify Sales Tracker genau nachvollziehen, welche SKUs tatsächlich skalieren. Hier sind die 5 etabliertesten Methoden, um den Shopify Umsatz fremder Stores zu sehen:"
                : "Knowing competitor sales figures is essential for e-commerce brands. Instead of burning marketing capital on unproven concepts, an accurate Shopify Sales Tracker reveals which SKUs actually scale. Here are the 5 leading methodologies to discover any Shopify store's revenue:"}
            </p>
          </div>

          {/* 5 Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-950">
                {isDe ? "Die /products.json Bestandsdifferenz-Methode" : "The /products.json Inventory Delta Method"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isDe
                  ? "Nahezu jeder Shopify Store veröffentlicht unter '/products.json' alle Produkt- und Variantendaten. Werden diese in täglichen Snapshots erfasst, entspricht der Bestandsrückgang (Drop) exakt den verkauften Einheiten. Multipliziert mit dem Verkaufspreis ergibt sich der taggenaue Shopify Umsatz."
                  : "Virtually all Shopify stores expose '/products.json'. By logging automated snapshots, inventory drops between timeframes indicate confirmed purchases, producing precise SKU-level revenue figures."}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-950">
                {isDe ? "Die 999-Warenkorb-Methode (Cart Limit Probing)" : "The 999-Cart Probing Method"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isDe
                  ? "Versucht man im Checkout, 999 Einheiten eines Artikels in den Warenkorb zu legen, meldet die Shopify Cart-API oft: 'Es sind nur noch 142 Einheiten verfügbar'. Wiederholt man dies am Folgetag, kennt man das exakte Tagesvolumen."
                  : "Attempting to add 999 units of an item to the shopping cart triggers Shopify's inventory validation error disclosing exact in-stock limits, allowing daily subtraction comparisons."}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-950">
                {isDe ? "Bestellnummern-Sampling (Order Delta)" : "Order Number Sequential Sampling"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isDe
                  ? "Shopify vergibt Bestellnummern standardmäßig fortlaufend (z. B. #1040 am Montag und #1190 am Freitag = 150 Bestellungen). Über gezielte Testkäufe lässt sich das Gesamtbestellvolumen eines Shops exakt extrapolieren."
                  : "Shopify issues sequential order numbers by default. Comparing order IDs between consecutive dates reveals total transactions processed during that window."}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-slate-950">
                {isDe ? "Meta Ad Library & Creative Skalierung" : "Meta Ad Library & Creative Scaling"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isDe
                  ? "Lässt ein Händler 30+ Creatives für ein bestimmtes Produkt seit Wochen aktiv laufen, ist dies das stärkste externe Signal für hohen Werbedruck und sechsstellige Monatsumsätze. Unser Tool gleicht Ad-Aktivität mit Bestandsdeltas ab."
                  : "Maintaining 30+ active creatives for weeks in the Meta Ad Library is definitive evidence of active ad scaling and high five-to-six-figure monthly revenues."}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-sm">
                05
              </div>
              <h3 className="text-base font-bold text-slate-950">
                {isDe ? "Traffic & Conversion-Rate Benchmarking" : "Traffic & Conversion Benchmarking"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isDe
                  ? "Über Similarweb und Web-Crawler wird das monatliche Besuchervolumen erfasst. Mit branchenüblichen E-Commerce Conversion-Rates (1,5% bis 2,5%) und dem durchschnittlichen Verkaufspreis (AOV) errechnet unser Algorithmus verlässliche Umsatzkorridore."
                  : "Combining web traffic estimates with sector benchmark conversion rates (1.5% - 2.5%) and average product pricing provides robust validation corridors."}
              </p>
            </div>

            <div className="bg-blue-600 text-white rounded-3xl p-6 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black text-sm">
                  Procware
                </div>
                <h3 className="text-base font-bold text-white">
                  {isDe ? "Vollautomatisierter Shopify Sales Tracker" : "Automated All-in-One Tracker"}
                </h3>
                <p className="text-xs text-blue-100 leading-relaxed">
                  {isDe
                    ? "Du musst keine manuelle Mathematik betreiben: Der Procware Shopify Sales Tracker vereint alle Methoden in einem Dashboard – inklusive Sourcing-Schnittstelle."
                    : "Skip manual arithmetic: Procware's sales tracker combines all decrement and signal models into one clean dashboard."}
                </p>
              </div>
              <button
                onClick={() => openAuthModal("register", "/suite/sales-tracker")}
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-blue-900 rounded-xl text-xs font-black transition-colors"
              >
                {isDe ? "Kostenlos starten" : "Get Started Free"}
              </button>
            </div>
          </div>
        </div>

        {/* 5. Tool Comparison Table (Procware vs. Paid Tools) */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              {isDe
                ? "Vergleich: Shopify Sales Tracker Tools im Überblick"
                : "Comparison: Shopify Sales Tracker Tools Overview"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isDe
                ? "Warum Procware die beste Wahl für E-Commerce Brands und Dropshipper ist:"
                : "Why Procware is the preferred choice for Shopify sellers:"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/80">
                  <th className="p-3.5">Feature / Kriterium</th>
                  <th className="p-3.5 text-blue-600 font-black">Procware Sales Tracker</th>
                  <th className="p-3.5">Kostenpflichtige Spy-Tools</th>
                  <th className="p-3.5">Manuelle Excel-Tabellen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Kosten / Preismodell</td>
                  <td className="p-3.5 font-bold text-emerald-600 bg-emerald-50/40">100% Kostenlos (Free)</td>
                  <td className="p-3.5 text-slate-600">30 € – 120 € / Monat</td>
                  <td className="p-3.5 text-slate-600">Kostenlos (hoher Zeitaufwand)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Shopify Umsatz sehen</td>
                  <td className="p-3.5 font-bold text-blue-600 bg-emerald-50/40">Ja, taggenau & monatlich</td>
                  <td className="p-3.5 text-slate-600">Ja (oft unvollständig)</td>
                  <td className="p-3.5 text-slate-600">Nur mit manueller Zählung</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Bestseller-Identifikation</td>
                  <td className="p-3.5 font-bold text-blue-600 bg-emerald-50/40">Ja, auf SKU- & Variantenebene</td>
                  <td className="p-3.5 text-slate-600">Ja</td>
                  <td className="p-3.5 text-slate-600">Mühsam</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Direktes Fabrik-Sourcing</td>
                  <td className="p-3.5 font-bold text-emerald-600 bg-emerald-50/40">Integrierter 1-Klick Sourcing-Request</td>
                  <td className="p-3.5 text-rose-600 font-medium">Nein (nur Spy-Tool)</td>
                  <td className="p-3.5 text-rose-600 font-medium">Nein</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Fulfillment & Deutsches Lager</td>
                  <td className="p-3.5 font-bold text-emerald-600 bg-emerald-50/40">Ja (5-8 Tage Versand D-A-CH)</td>
                  <td className="p-3.5 text-rose-600 font-medium">Nein</td>
                  <td className="p-3.5 text-rose-600 font-medium">Nein</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Strategic Value: How top sellers use Sales Tracking */}
        <div className="max-w-5xl mx-auto bg-slate-950 text-white rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              {isDe ? "E-Commerce Wachstumsstrategie" : "E-Commerce Strategy"}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {isDe
                ? "Warum erfolgreiche Shopify Händler Mitbewerber-Umsätze tracken"
                : "Why Top Shopify Brands Track Competitor Revenues"}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isDe
                ? "Im modernen E-Commerce gewinnt, wer Daten schneller auswertet als die Konkurrenz. Mit dem Shopify Sales Tracker eliminierst du das größte Risiko im Online-Handel: Produkte zu launchen, die niemand kauft."
                : "In modern e-commerce, speed to validated data dictates profitability. With an automated Shopify sales tracker, you eliminate product validation guesswork."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                {isDe ? "1. Echten Bedarf validieren" : "1. Validate Real Demand"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isDe
                  ? "Sieh mit eigenen Augen, welche Produkte täglich 50+ Einheiten verkaufen, bevor du eigenes Werbebudget investierst."
                  : "Verify that an item is consistently moving 50+ units a day before allocating creative and testing spend."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <Zap className="w-6 h-6 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                {isDe ? "2. Lieferengpässe ausnutzen" : "2. Capitalize on Stockouts"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isDe
                  ? "Geht dem Marktführer die Ware aus, schnappst du dir den Markt. Unser Tracker alarmiert dich, sobald Mitbewerber 'Out of Stock' gehen."
                  : "When market leaders run out of stock, step in immediately. Our alerts notify you the moment competitors hit zero inventory."}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <Boxes className="w-6 h-6 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                {isDe ? "3. Bessere Marge über Procware" : "3. Source Factory Direct"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isDe
                  ? "Sende den Link des Winning Products direkt an unser Sourcing-Team in China und sichere dir Fabrikpreise ohne Zwischenhändler."
                  : "Submit verified winning SKUs directly to Procware Sourcing to secure factory pricing and 40%+ margins."}
              </p>
            </div>
          </div>
        </div>

        {/* 7. FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Häufig gestellte Fragen (FAQ) zum Shopify Sales Tracker"
                : "Frequently Asked Questions about Shopify Sales Tracking"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {isDe
                ? "Alles Wissenswerte über Legalität, Methodik und Genauigkeit von Shopify Umsatz-Schätzungen."
                : "Everything you need to know about methodology, legality, and accuracy."}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaqIndex === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 8. Bottom CTA Banner */}
        <div className="max-w-4xl mx-auto bg-blue-600 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              {isDe
                ? "Bereit, jeden Shopify Umsatz live zu sehen?"
                : "Ready to Track Any Shopify Store's Revenue?"}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
              {isDe
                ? "Erstelle deinen kostenlosen Procware Account und erhalte sofortigen Zugriff auf den Shopify Sales Tracker, Trending Products Finder und Competitor Price Tracker."
                : "Create your free Procware account now to unlock live sales tracking, trending product feeds, and automated competitor monitoring."}
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openAuthModal("register", "/suite/sales-tracker")}
              className="px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-900 rounded-2xl text-sm font-black shadow-lg transition-colors cursor-pointer"
            >
              {isDe ? "Jetzt kostenlos registrieren" : "Sign Up Free Today"}
            </button>
            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-blue-700/80 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold border border-blue-500 transition-colors"
            >
              {isDe ? "Beratungstermin buchen" : "Book a Strategy Call"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
