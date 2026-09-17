import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Tag,
  TrendingDown,
  TrendingUp,
  Search,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  Bell,
  Layers,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Lock,
  DollarSign,
  BarChart3,
  HelpCircle,
  ChevronDown,
  Percent,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import { useAuth } from "../context/AuthContext";

interface CompetitorPriceTrackerPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
}

export const CompetitorPriceTrackerPage: React.FC<CompetitorPriceTrackerPageProps> = ({
  onOpenBooking,
  lang: propLang,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang: "de" | "en" =
    propLang || (location.pathname.startsWith("/en") ? "en" : "de");
  const { isAuthenticated, openAuthModal } = useAuth();
  const isDe = currentLang === "de";

  // Interactive Live Price Delta Calculator
  const [myPrice, setMyPrice] = useState<number>(39.99);
  const [competitorPrice, setCompetitorPrice] = useState<number>(34.99);
  const [cogsCost, setCogsCost] = useState<number>(9.5);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    applyToolSeo("competitorPriceTracker", currentLang);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentLang]);

  const priceDiff = competitorPrice - myPrice;
  const priceDiffPercent = myPrice > 0 ? (priceDiff / myPrice) * 100 : 0;
  const myCurrentMargin = myPrice > 0 ? ((myPrice - cogsCost) / myPrice) * 100 : 0;
  const matchMargin =
    competitorPrice > 0 ? ((competitorPrice - cogsCost) / competitorPrice) * 100 : 0;

  const handleToolAction = () => {
    if (isAuthenticated) {
      navigate("/suite/price-tracker");
    } else {
      openAuthModal("register", "/suite/price-tracker");
    }
  };

  const faqs = isDe
    ? [
        {
          q: "Wie funktioniert die automatisierte Preisüberwachung im Competitor Price Tracker?",
          a: "Du hinterlegst einfach die Produkt-URL deiner Mitbewerber. Unser System erfasst in regelmäßigen Intervallen automatisiert den aktuellen Verkaufspreis, den Streichpreis sowie den Verfügbarkeitsstatus. Sobald eine Preisänderung festgestellt wird, wird ein Zeitreihen-Snapshot angelegt und du erhältst sofort eine Benachrichtigung.",
        },
        {
          q: "Werden auch Rabattcodes und Streichpreise erkannt?",
          a: "Ja. Der Tracker liest strukturierte Mikrodaten (Schema.org / JSON-LD) sowie den sichtbaren HTML-Preis aus. So erkennst du sofort, ob ein Mitbewerber den regulären UVP gesenkt hat oder eine zeitlich befristete Rabattaktion fährt.",
        },
        {
          q: "Wie schützt mich das Tool vor unprofitablen Preiskämpfen?",
          a: "Durch den Abgleich mit deinen eigenen Einkaufspreisen (COGS) warnt dich der Price Tracker, bevor du Preise unüberlegt mitziehst. Du siehst sofort, wie stark deine Marge sinken würde und ob ein Preiskampf wirtschaftlich sinnvoll ist.",
        },
        {
          q: "Muss ich meine E-Mail-Adresse für Alerts angeben?",
          a: "Im System kannst du pro Produkt mit einer einfachen Checkbox festlegen, ob du bei Preisänderungen per E-Mail benachrichtigt werden möchtest. Deine E-Mail wird automatisch aus deinem verifizierten Account übernommen und kann jederzeit deaktiviert werden.",
        },
        {
          q: "Können auch ganze Online-Shops getrackt werden?",
          a: "Im Competitor Price Tracker werden gezielt konkrete Produkt-URLs überwacht, um millimetergenaue Zeitreihen-Charts pro SKU zu gewährleisten. Wenn du die Verkaufszahlen eines gesamten Shopify-Stores schätzen möchtest, nutze unseren Shopify Sales Tracker.",
        },
        {
          q: "Wie hilft mir Procware, wenn ein Konkurrent deutlich günstiger anbietet?",
          a: "Wenn ein Konkurrent den Preis drastisch senkt, hat er meist günstigere Einkaufskonditionen. Du kannst das Produkt direkt an das Procware Sourcing-Team übergeben: Wir verhandeln direkt mit zertifizierten Fabriken in China, um deine Einkaufspreise um 20% bis 40% zu senken.",
        },
      ]
    : [
        {
          q: "How does automated competitor price tracking work?",
          a: "Simply paste the product URL of any competitor. Our engine crawls the page at scheduled intervals, records current retail and compare-at prices into a time-series snapshot database, and notifies you immediately upon any detected price movement.",
        },
        {
          q: "Does the tracker record discount campaigns and promotional prices?",
          a: "Yes. The crawler inspects structured schema.org / JSON-LD product data and DOM pricing nodes to differentiate between permanent price reductions and temporary promotional sales.",
        },
        {
          q: "How does the tracker protect my gross profit margin?",
          a: "By factoring in your direct manufacturing costs (COGS), the tool alerts you before you enter an unsustainable race to the bottom, displaying the exact impact on your net margins before you adjust prices.",
        },
        {
          q: "Can I toggle email notifications per product?",
          a: "Yes. Each tracked item features a toggle for email alerts, using your verified account email automatically with zero spam.",
        },
        {
          q: "Does it track entire stores or specific SKUs?",
          a: "The Price Tracker focuses on individual product URLs to ensure accurate, granular time-series price graphs per SKU. For full-store sales volume estimation, use our Shopify Sales Tracker.",
        },
        {
          q: "How can Procware help if a competitor drastically undercuts me?",
          a: "If a competitor drops prices, they likely have superior factory procurement. Submit the product to Procware Sourcing: our teams in Shenzhen and Yiwu negotiate direct OEM pricing to restore your competitive edge.",
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
              Competitor Price Tracker
            </span>
          </div>
          <ToolLanguageSwitcher
            currentLang={currentLang}
            dePath="/competitor-price-tracker"
            enPath="/en/competitor-price-tracker"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-16">
        {/* 2. Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>
              {isDe
                ? "Procware Ecom Suite • Automatisierte Preisüberwachung & Alerts"
                : "Procware Ecom Suite • Automated Price Diffs & Alerts"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
            {isDe ? (
              <>
                Competitor Price Tracker:{" "}
                <span className="text-emerald-600">
                  Konkurrenzpreise live überwachen & Margen sichern
                </span>
              </>
            ) : (
              <>
                Competitor Price Tracker:{" "}
                <span className="text-emerald-600">
                  Real-Time Competitor Price Monitoring & Margin Defense
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {isDe
              ? "Verpasse nie wieder Preissenkungen deiner Mitbewerber im E-Commerce. Unser automatisierter Competitor Price Tracker überwacht Produkt-URLs in Echtzeit, dokumentiert historische Preisverläufe ohne Duplikate und benachrichtigt dich sofort per E-Mail, wenn Wettbewerber Rabatte fahren oder Preise anziehen."
              : "Never get undercut unexpectedly. Monitor competitor product URLs with our automated Competitor Price Tracker, record clean historical price trajectory snapshots, and receive instant email alerts whenever prices change."}
          </p>

          {/* Targeted Keyword Badges for Top Rankings */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] text-slate-500 font-medium">
            <span className="font-bold text-slate-700">Fokus-Keywords:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-semibold">
              Competitor Price Tracker
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-semibold">
              Shopify Price Tracker
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-semibold">
              Preisüberwachung Online-Shop
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/60 font-semibold">
              E-Commerce Price Intelligence
            </span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleToolAction}
              className="px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer group"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {isAuthenticated
                  ? isDe
                    ? "Live Price Tracker in Suite öffnen"
                    : "Open Price Tracker in Suite"
                  : isDe
                  ? "Jetzt kostenlos eigene Produkte überwachen"
                  : "Sign Up Free & Monitor Products"}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="#calculator"
              className="px-5 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-colors"
            >
              {isDe ? "Preiskampf-Rechner testen" : "Test Margin Calculator"}
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">
                {isDe ? "Tracking-Frequenz" : "Crawl Frequency"}
              </div>
              <div className="text-lg font-black text-slate-950">24/7 Automatisiert</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-xs text-slate-500 font-medium">
                {isDe ? "Benachrichtigung" : "Alert Method"}
              </div>
              <div className="text-lg font-black text-emerald-600">
                {isDe ? "Sofort per E-Mail" : "Instant Email"}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-500 font-medium">
                {isDe ? "Margenschutz" : "Procware Sourcing"}
              </div>
              <div className="text-lg font-black text-blue-600">
                {isDe ? "Direkt mit Fabrik-EK" : "Factory Cost Guard"}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Interactive Price War & Margin Simulator */}
        <section id="calculator" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{isDe ? "Interaktiver Preiskampf-Simulator" : "Interactive Price War Simulator"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Simuliere den Margen-Effekt von Konkurrenz-Preissenkungen"
                : "Simulate Margin Impact When Competitors Drop Prices"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal leading-relaxed">
              {isDe
                ? "Teste, was passiert, wenn dein Mitbewerber den Preis senkt. Lohnt sich ein Mitgehen oder musst du deine Einkaufskosten über Procware optimieren?"
                : "Calculate the exact impact on your gross margin before matching a competitor's discount."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Sliders */}
            <div className="lg:col-span-7 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    {isDe ? "Dein aktueller Verkaufspreis (€)" : "Your Current Retail Price ($)"}
                  </label>
                  <span className="text-sm font-black text-slate-950">{myPrice.toFixed(2)} €</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="1"
                  value={myPrice}
                  onChange={(e) => setMyPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    {isDe ? "Verkaufspreis des Mitbewerbers (€)" : "Competitor Price ($)"}
                  </label>
                  <span className="text-sm font-black text-slate-950">{competitorPrice.toFixed(2)} €</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="1"
                  value={competitorPrice}
                  onChange={(e) => setCompetitorPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    {isDe ? "Dein Wareneinkaufspreis / COGS (€)" : "Your Unit COGS ($)"}
                  </label>
                  <span className="text-sm font-black text-slate-950">{cogsCost.toFixed(2)} €</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="0.5"
                  value={cogsCost}
                  onChange={(e) => setCogsCost(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  {isDe
                    ? "Tipp: Procware Kunden senken ihren EK durch Direkt-Sourcing um durchschnittlich 28%."
                    : "Tip: Procware merchants reduce factory COGS by 28% on average via direct China sourcing."}
                </span>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 bg-linear-to-b from-slate-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isDe ? "Preisanalyse & Marge" : "Price & Margin Analysis"}
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <div className="text-xs text-slate-400 font-medium">
                  {isDe ? "Preisdifferenz zur Konkurrenz:" : "Price Difference:"}
                </div>
                <div className="text-xl font-black flex items-center gap-2">
                  {priceDiff < 0 ? (
                    <span className="text-red-400">
                      {priceDiff.toFixed(2)} € ({priceDiffPercent.toFixed(1)}%)
                    </span>
                  ) : priceDiff > 0 ? (
                    <span className="text-emerald-400">
                      +{priceDiff.toFixed(2)} € (+{priceDiffPercent.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-slate-300">0.00 € (Gleichstand)</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-normal">
                  {priceDiff < 0
                    ? isDe ? "Mitbewerber ist günstiger als du!" : "Competitor is undercutting you!"
                    : isDe ? "Du bist günstiger als der Mitbewerber." : "You are priced lower."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-slate-400 font-medium">{isDe ? "Deine aktuelle Marge:" : "Your Current Margin:"}</div>
                  <div className="text-base font-black text-white mt-1">
                    {myCurrentMargin.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                  <div className="text-slate-400 font-medium">{isDe ? "Marge bei Preisangleich:" : "Margin If Matched:"}</div>
                  <div
                    className={`text-base font-black mt-1 ${
                      matchMargin < 40 ? "text-amber-400" : "text-emerald-400"
                    }`}
                  >
                    {matchMargin.toFixed(1)}%
                  </div>
                </div>
              </div>

              <button
                onClick={handleToolAction}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isAuthenticated
                    ? isDe ? "Eigene Produkte im Tracker anlegen" : "Add Products in Price Tracker"
                    : isDe ? "Kostenlos Account erstellen & tracken" : "Free Sign Up & Start Tracking"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 4. Strategic Guide: Warum automatisiertes Preis-Monitoring 2026 unverzichtbar ist */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-3">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>{isDe ? "Strategischer Leitfaden" : "Strategic Guide"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Warum manuelles Preis-Checken deinen E-Commerce Store bares Geld kostet"
                : "Why Manual Price Checking Wastes Time and Destroys Margins"}
            </h2>
            <p className="text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              {isDe
                ? "E-Commerce-Märkte bewegen sich in Echtzeit. Top-Marken testen wöchentlich neue Preispunkte und Rabattstufen. Wenn du Änderungen erst nach Tagen bemerkst, verlierst du Werbe-Effizienz und Kunden:"
                : "E-Commerce pricing is fluid. If competitors launch unannounced discounts, your Meta ad ROAS plunges before you even notice:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-950 text-base">
                {isDe ? "Sofortige E-Mail-Warnung" : "Instant Email Alerts"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Du musst keine Tabellen mehr manuell pflegen. Sobald ein Konkurrent den Preis ändert, erhältst du automatisch eine Benachrichtigung."
                  : "Say goodbye to tedious manual spreadsheets. Receive automatic notifications the moment an monitored SKU alters its price."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm">
                <TrendingDown className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-950 text-base">
                {isDe ? "Historische Zeitreihen-Kurven" : "Historical Price Trends"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Klicke auf ein Produkt und sieh dir den genauen Verlauf über Tage und Wochen in einem interaktiven Graphen an."
                  : "Click any product to inspect clean historical price trend charts across multiple tracking dates."}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-950 text-base">
                {isDe ? "Schutz vor Dumping" : "Avoid Price Wars"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {isDe
                  ? "Senke Preise nicht blind. Prüfe, ob du mit deinen aktuellen Einkaufskosten profitabel bleibst oder ob dein Sourcing verbessert werden muss."
                  : "Never enter a race to the bottom blindly. Validate whether matching a discount remains profitable with your COGS."}
              </p>
            </div>
          </div>
        </section>

        {/* 4.5 In-Depth Strategy Guide: 4 Phasen der automatisierten Preisüberwachung */}
        <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isDe ? "Best-Practice Workflow" : "Pricing Architecture"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isDe
                ? "Der 4-Phasen-Workflow für professionelles Competitor Price Tracking"
                : "The 4-Phase Architecture of Automated Competitor Price Tracking"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
              {isDe
                ? "Wie führende D2C E-Commerce Brands Preisüberwachung nutzen, um Margen zu verteidigen und Marktanteile zu gewinnen:"
                : "How top direct-to-consumer brands operationalize price intelligence without getting pulled into unprofitable price wars:"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-emerald-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Phase 1" : "Phase 1"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Produkt-URL erfassen" : "Product SKU Crawling"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Hinterlege die exakte Produkt-URL deiner 3 bis 5 stärksten Mitbewerber. Unser Crawler extrahiert Titel, Bild, Währung und den aktuellen Verkaufspreis automatisiert."
                  : "Enter direct product URLs for key competitor SKUs. Our crawler automatically extracts metadata, currency, and baseline retail prices."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-emerald-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Phase 2" : "Phase 2"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Tägliche Snapshots" : "Daily Deduplication"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Der Price Tracker zeichnet an jedem unterschiedlichen Tag den finalen Preisstand auf. Keine unübersichtlichen Duplikate, sondern klare historische Entwicklungskurven."
                  : "Snapshots are deduplicated per distinct calendar day, generating clean, readable time-series price curves without duplicate dates."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-emerald-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Phase 3" : "Phase 3"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Sofortige E-Mail-Alerts" : "Instant Email Alerts"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Sobald ein Konkurrent den Preis um mehr als 5% ändert, erhältst du automatisch eine E-Mail. Du kannst Benachrichtigungen jederzeit pro Produkt aktivieren oder deaktivieren."
                  : "Get notified immediately via email whenever a competitor changes prices by 5% or more, with granular opt-out toggles per product."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-emerald-400 font-black text-sm uppercase tracking-wider">
                {isDe ? "Phase 4" : "Phase 4"}
              </div>
              <h3 className="font-bold text-white text-base">
                {isDe ? "Procware Sourcing Hebel" : "Procware Supply Advantage"}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {isDe
                  ? "Wenn Mitbewerber dauerhaft günstiger sind, gewinnst du nicht durch Margenverzicht, sondern durch günstigere Einkaufspreise an der Quelle in China mit Procware."
                  : "Win against lower prices by securing direct factory prices in China with Procware, lowering your unit COGS while preserving 60%+ margins."}
              </p>
            </div>
          </div>
        </section>

        {/* 5. FAQ Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isDe ? "Häufig gestellte Fragen" : "Frequently Asked Questions"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Fragen & Antworten zum Competitor Price Tracker"
                : "FAQ: Competitor Price Monitoring"}
            </h2>
          </div>

          <div className="divide-y divide-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-slate-950 hover:text-emerald-600 transition-colors cursor-pointer py-1"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-600" : ""
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

        {/* 6. Conversion Box */}
        <section className="rounded-3xl bg-linear-to-b from-emerald-50/80 to-emerald-100/50 border border-emerald-200 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
            <Tag className="w-8 h-8 text-emerald-700" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {isDe
                ? "Überwache deine Mitbewerber jetzt 24/7 vollautomatisch"
                : "Automate Your Competitor Price Tracking 24/7"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              {isDe
                ? "Erstelle deinen kostenlosen Account und trage deine ersten Produkt-URLs ein. Erhalte sofortige E-Mail-Benachrichtigungen bei jeder Preisänderung."
                : "Create your free account, paste your target product URLs, and receive immediate alerts whenever prices shift."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleToolAction}
              className="px-8 py-4 rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white font-black text-sm shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>
                {isAuthenticated
                  ? isDe ? "Zur Ecom Suite wechseln" : "Open Ecom Suite"
                  : isDe ? "Kostenlos starten & Preise tracken" : "Start Tracking for Free"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://calendly.com/team-procware/new-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-2xs transition-colors inline-flex items-center gap-2"
            >
              <span>{isDe ? "Erstgespräch buchen" : "Book Consultation"}</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
