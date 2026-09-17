import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Flame,
  TrendingUp,
  Search,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpRight,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Target,
  BarChart3,
  Video,
  Truck,
  Percent,
  Zap,
  Lock,
  DollarSign,
  Boxes,
  Compass,
} from "lucide-react";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import { useAuth } from "../context/AuthContext";
import { TRENDING_PRODUCTS_CATALOG } from "../services/intelligenceService";

interface TrendingProductsFinderPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
}

export const TrendingProductsFinderPage: React.FC<TrendingProductsFinderPageProps> = ({
  onOpenBooking,
  lang: propLang,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang: "de" | "en" =
    propLang || (location.pathname.startsWith("/en") ? "en" : "de");
  const { isAuthenticated, openAuthModal } = useAuth();
  const isDe = currentLang === "de";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    applyToolSeo("trendingProducts", currentLang);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentLang]);

  const handleToolAction = () => {
    if (isAuthenticated) {
      navigate("/suite/trending-products");
    } else {
      openAuthModal("register", "/suite/trending-products");
    }
  };

  const categories = [
    { id: "all", labelDe: "Alle Kategorien", labelEn: "All Categories" },
    { id: "Health & Ergonomics", labelDe: "Gesundheit & Ergonomie", labelEn: "Health & Ergonomics" },
    { id: "Home & Decor", labelDe: "Home & Living", labelEn: "Home & Decor" },
    { id: "Beauty & Personal Care", labelDe: "Beauty & Pflege", labelEn: "Beauty & Care" },
    { id: "Pet Supplies", labelDe: "Haustierbedarf", labelEn: "Pet Supplies" },
    { id: "Tech & Accessories", labelDe: "Tech & Gadgets", labelEn: "Tech & Gadgets" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? TRENDING_PRODUCTS_CATALOG
      : TRENDING_PRODUCTS_CATALOG.filter((p) => p.category === selectedCategory);

  const faqs = isDe
    ? [
        {
          q: "Was genau ist ein 'Winning Product' im E-Commerce und Dropshipping?",
          a: "Ein Winning Product ist ein E-Commerce-Artikel, der sich durch ein klares Problemlösungspotenzial, einen starken visuellen 'Wow-Effekt' (Hook-Tauglichkeit für Video-Ads auf TikTok und Meta), eine Rohmarge von mindestens 65-75% und ein stark skalierbares Werbepotenzial auszeichnet. Entscheidend ist, dass das Produkt noch nicht von hunderten Mitbewerbern gesättigt ist.",
        },
        {
          q: "Warum ist die Wachstumsrate (Week-over-Week) wichtiger als die Gesamtzahl der Verkäufe?",
          a: "Herkömmliche Spy-Tools und AliExpress sortieren nach 'Gesamtverkäufen'. Ein Produkt mit 50.000 Gesamtbestellungen ist jedoch meist schon seit Monaten auf dem Markt und von Top-Brands durchdrungen. Unser Trending Products Finder misst die Wachstumsbeschleunigung der letzten 7 Tage im Vergleich zur Vorwoche (+100% bis +400% WoW). Dadurch erkennst du frische Breakout-Wellen genau dann, wenn die Nachfrage explodiert, aber noch kaum Konkurrenten Anzeigen schalten.",
        },
        {
          q: "Wie werden die Trenddaten und Verkaufssignale ermittelt?",
          a: "Unser Crawler analysiert täglich zehntausende öffentliche Bestands- und Transaktionssignale aus Shopify-Stores, Großhandelsmarktplätzen und der Meta Ad Library. Durch den Abgleich von täglichen Inventar-Deltas und neuen aktiven Werbe-Creatives filtern wir Produkte mit echtem Ad-Spend-Wachstum heraus.",
        },
        {
          q: "Kann ich gefundene Trendprodukte direkt über Procware beschaffen?",
          a: "Ja, genau das ist der größte Vorteil von Procware: Sobald du ein profitables Produkt identifiziert hast, kannst du mit 1 Klick ein Sourcing-Angebot anfordern. Unsere Teams vor Ort in Shenzhen und Yiwu verhandeln direkt mit zertifizierten Fabriken, prüfen Muster auf Qualität und organisieren den Expressversand nach Europa (6-8 Werktage).",
        },
        {
          q: "Welche Produkte sollte man 2026 im Dropshipping unbedingt meiden?",
          a: "Vermeide Produkte mit hoher Retourenquote (z. B. komplexe Kleidergrößen S/M/L/XL ohne Dehnbarkeit), zerbrechliche Glaswaren, überdimensionierte Sperrgüter mit teuren Luftfrachtkosten sowie geschützte Markenprodukte. Fokussiere dich stattdessen auf leichte, bruchsichere Problemlöser mit hohem wahrgenommenem Wert.",
        },
        {
          q: "Ist der Trending Products Finder kostenlos nutzbar?",
          a: "Ja! Du kannst die Trendsignale und Ratgeber öffentlich auf dieser SEO-Seite einsehen. Für den vollen Zugriff auf alle 50+ Live-Produkte, historische Zeitreihen-Charts und individuelle Watchlists genügt ein kostenloser Procware-Account ohne Kreditkarte.",
        },
      ]
    : [
        {
          q: "What defines a true 'Winning Product' in E-Commerce & Dropshipping?",
          a: "A winning product solves a distinct consumer pain point, delivers an instant visual 'wow' hook for TikTok and Meta video ads, maintains a gross margin above 65-75%, and offers substantial scaling runway without excessive competitor saturation.",
        },
        {
          q: "Why is Week-over-Week (WoW) growth velocity superior to cumulative sales volume?",
          a: "Legacy spy tools rank items by all-time cumulative sales. A product with 50,000 all-time orders is already saturated. Our algorithm isolates 7-day velocity acceleration (+100% to +400% WoW), discovering viral spikes at inception before hundreds of competing ad buyers jump in.",
        },
        {
          q: "How does the trend tracking algorithm collect data?",
          a: "We process automated inventory deltas, supplier transaction spikes, and Meta Ad Library creative count explosions across thousands of top DTC brands, isolating real scaling ad spend from fake review volume.",
        },
        {
          q: "Can I source these products directly through Procware?",
          a: "Yes! Procware operates native sourcing offices in Shenzhen and Yiwu. In 1 click, you can request factory-direct quotations with custom branding, strict quality inspections, and expedited 6-8 day European fulfillment.",
        },
        {
          q: "Which product categories should e-commerce sellers avoid in 2026?",
          a: "Steer clear of heavy or fragile items with excessive freight costs, complex apparel with high size-related return rates, and trademarked IP. Focus on lightweight, high-perceived-value problem solvers.",
        },
        {
          q: "Is the Trending Products Finder free to use?",
          a: "Yes. You can explore curated trend overviews on this public page. Unlocking full daily updates, time-series chart deep dives, and custom alerts requires only a free Procware account.",
        },
      ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. Header Breadcrumbs */}
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
            <span className="text-slate-900 font-extrabold">
              Trending Products Finder
            </span>
          </div>
          <ToolLanguageSwitcher
            currentLang={currentLang}
            dePath="/trending-products"
            enPath="/en/trending-products"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-16">
        {/* 2. Hero Section with Strong SEO Headline & Search Terms */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>
              {isDe
                ? "Procware Ecom Suite • Winning Products vor Marktsättigung finden"
                : "Procware Ecom Suite • Discover Winning Products Before Saturation"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
            {isDe ? (
              <>
                Trending Products:{" "}
                <span className="text-amber-500">
                  Winning Products for Dropshipping & Shopify 2026
                </span>
              </>
            ) : (
              <>
                Trending Products:{" "}
                <span className="text-amber-500">
                  Best Trending Products for Dropshipping & Shopify
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {isDe
              ? "Entdecke ungesättigte Trending Products for Dropshipping und E-commerce: Unser Algorithmus filtert die 7-Tage-Bestellbeschleunigung (Week-over-Week), Meta Ad Library Werbeaktivität und Social-Commerce-Signale – damit du virale Shopify Trending Products findest, bevor sie von Hunderten Händlern kopiert werden."
              : "Discover unsaturated Trending Products for Dropshipping and E-commerce: Our algorithm tracks 7-day velocity spikes (Week-over-Week), active Meta Ads scaling, and social proof to pinpoint top-selling Shopify Trending Products before market saturation."}
          </p>

          {/* Targeted Keyword Badges for Top Rankings */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-700">Fokus-Themen:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold">
              Trending Products
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold">
              Trending Products for Dropshipping
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold">
              E-commerce Trending Products
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/60 font-semibold">
              Shopify Trending Products
            </span>
          </div>

          {/* Quick CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleToolAction}
              className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>
                {isAuthenticated
                  ? isDe
                    ? "Live Trend-Datenbank in Suite öffnen"
                    : "Open Live Trend Database in Suite"
                  : isDe
                  ? "Jetzt kostenlos alle 50+ Trends freischalten"
                  : "Sign Up Free & Unlock All 50+ Trends"}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="#formula-guide"
              className="px-5 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
            >
              {isDe ? "Winning Product Kriterien lesen" : "Winning Product Criteria"}
            </a>
          </div>

          {/* Fast Trust Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">
                {isDe ? "Gescannte Produkte" : "Weekly Tracked Items"}
              </div>
              <div className="text-lg font-black text-slate-950">50.000+ / Woche</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">
                {isDe ? "Wachstums-Algorithmus" : "Growth Velocity Model"}
              </div>
              <div className="text-lg font-black text-amber-600">7-Tage WoW Signal</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-500 font-medium">
                {isDe ? "Procware China Sourcing" : "Direct Factory Sourcing"}
              </div>
              <div className="text-lg font-black text-emerald-600">
                {isDe ? "Direktabwicklung" : "Direct Fulfillment"}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Live Catalog Showcase with Category Tabs */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isDe ? "Echtzeit-Trendanalyse" : "Real-Time Trend Feed"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {isDe
                  ? "Aktuelle Trend-Signale mit stärkster Wachstumsdynamik"
                  : "Breakout Products with Highest 7-Day Velocity"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {isDe
                  ? "Produkte mit bestätigtem Auftragssprung in den letzten 7 Tagen (WoW). Klicke auf ein Produkt, um es in der Suite zu öffnen."
                  : "Verified order acceleration over the past 7 days. Click any item to inspect time series snapshots in the Suite."}
              </p>
            </div>

            <button
              onClick={handleToolAction}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>{isDe ? "Alle 50+ Trends in der Suite anzeigen" : "View all 50+ products in Suite"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-slate-200 pb-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {isDe ? cat.labelDe : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => {
              const grossProfit = item.price - item.supplierCost;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Header with Trend Badge */}
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider">
                        {item.category}
                      </div>

                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-sm uppercase flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-slate-950" />
                        <span>
                          {item.trendPhase === "early_breakout"
                            ? isDe ? "Früher Breakout" : "Early Breakout"
                            : isDe ? "Hohes Wachstum" : "High Growth"}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-md text-xs font-black text-slate-950 flex items-center gap-1.5 border border-slate-100">
                        <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                        <span>+{item.growthRatePercent.toFixed(1)}% WoW</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-3.5">
                      <h3 className="font-extrabold text-slate-950 text-base leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Performance Metric Matrix */}
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">
                            {isDe ? "7-Tage-Bestellungen:" : "7-Day Orders:"}
                          </span>
                          <span className="font-extrabold text-slate-950">
                            {item.ordersLast7d.toLocaleString(isDe ? "de-DE" : "en-US")} Stk.
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">
                            {isDe ? "Vorwoche (Vergleich):" : "Previous Week:"}
                          </span>
                          <span className="font-medium text-slate-600">
                            {item.ordersPrev7d.toLocaleString(isDe ? "de-DE" : "en-US")} Stk.
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">
                            {isDe ? "Aktive Werbeanzeigen:" : "Active Meta Ads:"}
                          </span>
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {item.activeMetaAds} Creatives
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-200/70 grid grid-cols-2 gap-2 text-left">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {isDe ? "Shop-Verkaufspreis" : "Retail Price"}
                            </span>
                            <span className="font-black text-slate-900 text-sm">
                              {item.price.toFixed(2)} €
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {isDe ? "Trend-Status" : "Trend Status"}
                            </span>
                            <span className="font-bold text-amber-600 text-xs flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3" />
                              <span>{isDe ? "Ungesättigt" : "Unsaturated"}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[11px] font-bold text-slate-700 bg-amber-50/60 p-2 rounded-xl border border-amber-100/60">
                          <span className="text-slate-600 font-medium">
                            {isDe ? "Procware Sourcing:" : "Procware Sourcing:"}
                          </span>
                          <span className="text-amber-800 font-extrabold flex items-center gap-1">
                            <Package className="w-3 h-3 text-amber-600" />
                            <span>{isDe ? "Fabrikpreis anfragbar" : "Request Factory Price"}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={handleToolAction}
                      className="w-full py-3 rounded-xl bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs shadow-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
                      <span>
                        {isAuthenticated
                          ? isDe
                            ? "In Ecom Suite analysieren"
                            : "Open in Ecom Suite"
                          : isDe
                          ? "Tool nutzen & Sourcing prüfen (Login)"
                          : "Unlock Full Tool & Sourcing (Login)"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gating Teaser Banner */}
          <div className="p-8 rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isDe ? "Vollständige Ecom Suite" : "Full Ecom Suite Access"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                {isDe
                  ? "50+ weitere verifizierte Trendprodukte in der Live-Suite"
                  : "Access 50+ More Live Trend Signals in the Suite"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
                {isDe
                  ? "Erhalte Zugriff auf tägliche Aktualisierungen, 30-Tage Zeitreihen-Snapshots, Meta-Ad-Links und direkte 1-Klick Sourcing-Anfragen an unser Büro in China."
                  : "Get full access to daily crawl updates, 30-day snapshot history, ad creative links, and 1-click China factory sourcing quotations."}
              </p>
            </div>

            <button
              onClick={handleToolAction}
              className="px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <span>
                {isAuthenticated
                  ? isDe ? "Suite öffnen" : "Launch Suite"
                  : isDe ? "Kostenlos registrieren" : "Free Sign Up"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 4. Deep-Dive Guide: Die 5-Faktoren Winning Product Formel */}
        <section id="formula-guide" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-3">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>{isDe ? "E-Commerce Strategie 2026" : "E-Commerce Strategy 2026"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Die 5-Faktoren-Formel: Was macht ein Produkt zum echten Winning Product?"
                : "The 5-Factor Formula: What Truly Defines a Winning E-Commerce Product?"}
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              {isDe
                ? "Über 90% der Dropshipping-Anfänger scheitern, weil sie beliebige Produkte ohne strategische Prüfung bewerben. Vor jedem Kampagnenstart müssen diese 5 Kernkriterien erfüllt sein:"
                : "Over 90% of e-commerce beginners fail because they test arbitrary products without strategic validation. Every prospective winner must pass these 5 tests:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Factor 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                <span>{isDe ? "Echter Problemlöser oder 'Wow-Effekt'" : "Problem Solver or Wow-Effect"}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Produkte müssen entweder einen spürbaren Schmerzpunkt lindern (z. B. Nackenschmerzen, Tierhaare, Zahnverfärbungen) oder eine verblüffende Vorher-Nachher-Transformation bieten, die sofort Aufmerksamkeit fesselt."
                  : "The item must either solve a painful problem (back pain, pet hair shedding) or deliver a striking visual before/after transformation that hooks attention in under 3 seconds."}
              </p>
            </div>

            {/* Factor 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                <span>{isDe ? "Robuste Margen-Architektur (> 65%)" : "Healthy Margin Architecture (>65%)"}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Bei heutigen Werbekosten (CPAs von 15 € bis 30 €) sind Produkte mit unter 30 € Marge kaum profitabel skalierbar. Du benötigst mindestens einen 3x bis 4x Aufschlag zwischen Fabrik-Einkaufspreis und Verkaufspreis."
                  : "With Meta/TikTok acquisition costs averaging $15-$35 per sale, products with slim profit buffers bleed money. Aim for a 3x to 4x markup over factory purchasing price."}
              </p>
            </div>

            {/* Factor 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                <span>{isDe ? "TikTok & Reels Werbetauglichkeit" : "TikTok & Reels Visual Proof"}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Das Produkt muss in den ersten 3 Sekunden eines Videos ('The Hook') Neugier wecken. Langweilige Gebrauchsgegenstände, die keine emotionale Reaktion erzeugen, haben zu hohe Klickpreise (CPMs)."
                  : "The product function must be clearly demonstrable in video creatives. If a creator cannot showcase the benefit within the first 3 seconds, ad conversion rates plummet."}
              </p>
            </div>

            {/* Factor 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                4
              </div>
              <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                <span>{isDe ? "Kompakte Logistik & Bruchfestigkeit" : "Compact Logistics & Low Return Rate"}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Leichte Artikel (< 500g) lassen sich extrem günstig per Luftfracht (z. B. über Procware Express in 6-8 Werktagen) versenden. Keine sperrigen Maße, kein dünnes Glas und keine komplexen Modegrößen (S/M/L/XL)."
                  : "Items under 500g qualify for cost-effective express air courier lines (Procware 6-8 day European transit). Avoid fragile glass, heavy weights, or complex sizing variations."}
              </p>
            </div>

            {/* Factor 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black text-sm">
                5
              </div>
              <h3 className="font-extrabold text-slate-950 text-base flex items-center gap-2">
                <span>{isDe ? "Frische Wachstumsbeschleunigung (WoW)" : "Order Velocity Acceleration (WoW)"}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Das Produkt befindet sich in der frühen Breakout-Phase (Bestellungen steigen um 100% bis 300% WoW), während die Zahl der Konkurrenz-Shops in der Meta Ad Library noch unter 30 liegt. Hier liegt der maximale Profit."
                  : "The item is accelerating in the breakout phase (orders up +100% to +300% WoW) while fewer than 30 competitors are running active campaigns. That is where peak margins live."}
              </p>
            </div>

            {/* Direct Link to Procware Sourcing */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-black text-sm mb-3">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-950 text-base">
                  {isDe ? "Procware Qualitäts-Sourcing" : "Procware Direct Sourcing"}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {isDe
                    ? "Vermeide unzuverlässige AliExpress-Verkäufer. Mit Procware erhältst du Fabrikpreise direkt an der Quelle in China, inklusive 100% Qualitätskontrolle vor dem Versand."
                    : "Bypass unreliable marketplace middlemen. Procware sources straight from verified factories in Shenzhen and Yiwu with full quality inspection before export."}
                </p>
              </div>
              <a
                href="https://calendly.com/team-procware/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-xs font-black text-amber-900 hover:text-amber-700 flex items-center gap-1.5"
              >
                <span>{isDe ? "Sourcing-Gespräch vereinbaren" : "Book Sourcing Consultation"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* 5. Method Comparison Table: Warum traditionelle Produktrecherche scheitert */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Vergleich: Warum herkömmliche Produktrecherche-Methoden scheitern"
                : "Comparison: Why Legacy Product Hunting Methods Fail"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              {isDe
                ? "Wer heute noch auf AliExpress-Bestsellerlisten setzt, verbrennt Werbebudget. Ein systematischer Vergleich der Research-Ansätze:"
                : "Relying on generic marketplace bestseller lists leads to burned ad spend. Compare modern velocity intelligence against legacy approaches:"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-3.5 font-black text-slate-900">{isDe ? "Kriterium" : "Feature"}</th>
                  <th className="p-3.5 font-bold text-slate-600">{isDe ? "AliExpress Bestseller" : "AliExpress Bestsellers"}</th>
                  <th className="p-3.5 font-bold text-slate-600">{isDe ? "TikTok Creative Center" : "TikTok Creative Center"}</th>
                  <th className="p-3.5 font-bold text-slate-600">{isDe ? "Klassische Spy-Tools" : "Generic Spy Tools"}</th>
                  <th className="p-3.5 font-black text-amber-700 bg-amber-50/80">
                    {isDe ? "Procware Trending Finder" : "Procware Trending Finder"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">{isDe ? "Daten-Fokus" : "Data Focus"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Gesamtverkäufe (kumuliert)" : "Cumulative all-time sales"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Aufrufe / Likes" : "Views / Likes"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Anzeigen-Laufzeit" : "Ad runtime"}</td>
                  <td className="p-3.5 font-extrabold text-amber-700 bg-amber-50/40">
                    {isDe ? "7-Tage Wachstumsrate (WoW Velocity)" : "7-Day Velocity Surge (WoW)"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">{isDe ? "Marktsättigung" : "Saturation Risk"}</td>
                  <td className="p-3.5 text-red-600 font-medium">{isDe ? "Extrem hoch (oft monatealt)" : "Extreme (often months old)"}</td>
                  <td className="p-3.5 text-amber-600 font-medium">{isDe ? "Mittel bis hoch" : "Medium to high"}</td>
                  <td className="p-3.5 text-amber-600 font-medium">{isDe ? "Hoch (jeder sieht die Ads)" : "High (widely copied)"}</td>
                  <td className="p-3.5 font-extrabold text-emerald-700 bg-amber-50/40">
                    {isDe ? "Gering (Frühe Breakout-Phase)" : "Low (Early breakout phase)"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">{isDe ? "Margen & EK-Transparenz" : "Factory Cost Clarity"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Überhöhte Dropshipping-Preise" : "Marked-up drop prices"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Keine EK-Daten" : "No cost data"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Oft ungenau / geschätzt" : "Rough estimates"}</td>
                  <td className="p-3.5 font-extrabold text-emerald-700 bg-amber-50/40">
                    {isDe ? "Echte Procware Fabrik-Preise (China)" : "Direct Procware Factory Quotations"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">{isDe ? "Direktes Sourcing & Fulfillment" : "Direct Supply Chain"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Keine Integration" : "None"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Keine Integration" : "None"}</td>
                  <td className="p-3.5 text-slate-500">{isDe ? "Keine Integration" : "None"}</td>
                  <td className="p-3.5 font-extrabold text-blue-700 bg-amber-50/40">
                    {isDe ? "1-Klick Sourcing mit QC in China" : "1-Click Sourcing & 6-8d Fulfillment"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Step-by-Step Guide: In 4 Schritten zum skalierten Shopify Store */}
        <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{isDe ? "Schritt-für-Schritt Roadmap" : "Step-by-Step Roadmap"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isDe
                ? "In 4 Schritten von der Trend-Erkennung zum profitablen Shopify Store"
                : "From Trend Signal to 6-Figure Shopify Store in 4 Steps"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-normal leading-relaxed">
              {isDe
                ? "So kombinierst du moderne Trend-Intelligenz mit professioneller China-Lieferkette für nachhaltiges E-Commerce-Wachstum:"
                : "How top direct-to-consumer merchants turn raw velocity data into high-converting Shopify stores:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-amber-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Schritt 1" : "Step 1"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Trendsignal filtern" : "Filter Velocity Surge"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Wähle im Trending Products Finder Artikel mit über 100% WoW-Wachstum und einer Marge über 65%. Prüfe, ob das Produkt ein klares Problem löst."
                  : "Scan for items exceeding +100% WoW acceleration with profit margins above 65%. Verify the product delivers an instant hook."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-amber-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Schritt 2" : "Step 2"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Meta Ads analysieren" : "Analyze Ad Creatives"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Öffne die Meta Ad Library und analysiere, welche Creatives der Konkurrenz schon länger als 14 Tage aktiv sind. Notiere erfolgreiche Hooks und Angles."
                  : "Inspect competitor creatives running in the Meta Ad Library for 14+ days. Isolate top performing angles, visual hooks, and customer objections."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-amber-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Schritt 3" : "Step 3"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Fabrik-Sourcing mit Procware" : "Procware Factory Sourcing"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Sende eine Sourcing-Anfrage an unser China-Team. Wir sichern dir direkte Fabrikpreise, Musterprüfungen und Express-Fulfillment in 6-8 Werktagen."
                  : "Request factory pricing directly from our team in Shenzhen. We negotiate OEM bulk rates, perform sample checks, and configure 6-8 day European shipping."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-amber-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Schritt 4" : "Step 4"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Shopify Funnel skaliert testen" : "Launch & Scale on Shopify"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Baue eine conversion-starke Produktseite auf Shopify und teste 3-5 Video-Creative-Hooks auf TikTok und Meta. Skaliere Gewinner-Anzeigen profitabel."
                  : "Build a high-converting single product funnel on Shopify. Test 3-5 distinct creative hooks across TikTok and Meta, then scale winning ads."}
              </p>
            </div>
          </div>
        </section>

        {/* 6.5 Deep Editorial SEO Guide: Top E-commerce & Dropshipping Trending Products Categories */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{isDe ? "Trend-Analyse & Nischen" : "Niche & Category Trends"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Trending Products for Dropshipping: Die profitabelsten E-commerce Kategorien 2026"
                : "Trending Products for Dropshipping: Most Profitable E-commerce Niches"}
            </h2>
            <p className="text-sm text-slate-600 font-normal leading-relaxed">
              {isDe
                ? "Nicht jede Nische eignet sich für profitables Werbeschalten. Erfolgreiche Shopify Trending Products vereinen emotionale Ansprache mit soliden Deckungsbeiträgen. Hier sind die 4 führenden Kategorien für E-commerce Trending Products:"
                : "Not every niche scales profitably on paid ad channels. High-performing Shopify Trending Products balance emotional video proof with solid margins. Here are the top 4 categories:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 text-base">
                  {isDe ? "1. Health, Ergonomie & Pain-Relief" : "1. Health, Ergonomics & Pain-Relief"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {isDe ? "Hohe Zahlungsbereitschaft" : "High Perceived Value"}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Orthopädische Nackenkissen, Dekompressionsgürtel, Rotlicht-Therapiegeräte und Haltungskorrektoren gehören zu den stabilsten Trending Products for Dropshipping. Kunden mit chronischen Beschwerden sind unempfindlich gegenüber Preisen zwischen 49 € und 99 €."
                  : "Cervical traction pillows, red-light facial panels, and lumbar support braces consistently generate massive order velocity. Pain relief drives impulse purchase conversion rates."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 text-base">
                  {isDe ? "2. Aesthetic Home, Gadgets & Living" : "2. Aesthetic Home & Smart Living"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {isDe ? "Virales TikTok-Potenzial" : "Viral Video Hook"}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Kabellose Designer-Atmosphärenleuchten, Ultraschall-Diffuser mit Flammeneffekt und multifunktionale Küchenorganizer dominieren Social Feeds. Diese E-commerce Trending Products überzeugen visuell in den ersten 3 Sekunden jedes Reels."
                  : "Atmospheric ambient lighting, flame-effect humidifiers, and sleek countertop organizers dominate TikTok organic and spark ads with immense organic virality."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 text-base">
                  {isDe ? "3. Beauty, Skincare & Personal Care" : "3. Beauty, Skincare & Personal Care"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {isDe ? "Hohe Wiederkaufrate" : "Repeat Purchase Upsells"}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Mikrostrom-Gesichtsformer, Ionen-Heißluftbürsten und schmerzfreie Haarentferner sind Evergreen Shopify Trending Products. Sie bieten enorme Hebelwirkung für Bundles (z. B. 2 Stück mit 20% Rabatt) und treiben den durchschnittlichen Warenkorbwert (AOV) nach oben."
                  : "Microcurrent sculpting wands and ionic hair styling tools allow lucrative bundle offers and strong AOV expansion across cold meta traffic."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-950 text-base">
                  {isDe ? "4. Pet Supplies & Haustier-Zubehör" : "4. Pet Supplies & Animal Well-being"}
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                  {isDe ? "Emotionale Zielgruppe" : "Emotional Consumer Bond"}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Haustierbesitzer investieren leidenschaftlich gerne in das Wohlbefinden ihrer Hunde und Katzen: Orthopädische Beruhigungsbetten, Anti-Schling-Futternäpfe und automatische Wasserspender sind bewährte Winning Products im E-Commerce."
                  : "Pet parents spend passionately on their pets' comfort: calming donut beds, slow-feed stimulation bowls, and automated drinking fountains are staple winning dropshipping products."}
              </p>
            </div>
          </div>
        </section>

        {/* 7. Comprehensive FAQ Section (Rich Snippets SEO) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>{isDe ? "Häufig gestellte Fragen" : "Frequently Asked Questions"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Fragen & Antworten zum Trending Products Finder & Winning Products"
                : "FAQ: Winning Products, Dropshipping & Trend Hunting"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              {isDe
                ? "Alles, was du über Produktrecherche, Marktsättigung und die Procware Ecom Suite wissen musst."
                : "Everything you need to know about e-commerce trend detection and sourcing."}
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-slate-950 hover:text-blue-600 transition-colors cursor-pointer py-1"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pr-6">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Conversion Sign-up Call to Action */}
        <section className="rounded-3xl bg-linear-to-b from-amber-50/80 to-amber-100/50 border border-amber-200 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-400/30 border border-amber-300 flex items-center justify-center mx-auto text-amber-800">
            <Flame className="w-8 h-8 fill-amber-500 text-amber-600" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Finde jetzt dein nächstes Winning Product für deinen Shopify Store"
                : "Find Your Next Winning Product for Shopify Today"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {isDe
                ? "Melde dich kostenlos an und erhalte sofortigen Zugriff auf die gesamte Trend-Datenbank, historische Zeitreihen und direkte China-Sourcing-Konditionen."
                : "Sign up for free and get instant access to the complete live database, velocity metrics, and direct China factory procurement."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleToolAction}
              className="px-8 py-4 rounded-2xl bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-black text-sm shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-amber-400" />
              <span>
                {isAuthenticated
                  ? isDe ? "Zur Ecom Suite wechseln" : "Open Ecom Suite"
                  : isDe ? "Kostenlos starten & Trends öffnen" : "Get Started Free & Unlock Trends"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-2xs transition-colors inline-flex items-center gap-2"
            >
              <span>{isDe ? "Procware Sourcing anfragen" : "Book Sourcing Consultation"}</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
