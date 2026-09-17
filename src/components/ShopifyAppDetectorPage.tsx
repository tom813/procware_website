import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Globe,
  Cpu,
  Layers,
  HelpCircle,
  ArrowRight,
  Code2,
  RefreshCw,
  X,
  Store,
  Tag,
  ShieldCheck,
  ShoppingBag,
  Filter,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useCompetitors } from "../context/CompetitorContext";
import { AppDetectionResult, DetectedAppDetail } from "../data/shopifyAppsData";

interface ShopifyAppDetectorPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
  hideSeoContent?: boolean;
}

export const ShopifyAppDetectorPage: React.FC<ShopifyAppDetectorPageProps> = ({
  onOpenBooking,
  lang: propLang,
  hideSeoContent = false,
}) => {
  const location = useLocation();
  const { competitors } = useCompetitors();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    if (!hideSeoContent) {
      applyToolSeo("appDetector", currentLang);
      window.scrollTo(0, 0);
    }
  }, [currentLang, hideSeoContent]);

  const [urlInput, setUrlInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AppDetectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [manualSourceMode, setManualSourceMode] = useState<boolean>(false);
  const [manualHtml, setManualHtml] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const sanitizeUrl = (input: string): string => {
    let clean = input.trim();
    if (!clean) return "";
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    return clean;
  };

  const handleDetect = async (overrideUrl?: string) => {
    const rawTarget = overrideUrl || urlInput;
    if (!rawTarget.trim()) {
      setErrorMsg("Bitte gib eine gültige Domain oder Shop-URL ein (z. B. snocks.com).");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setResult(null);
    setSelectedCategory("all");

    const cleanUrl = sanitizeUrl(rawTarget);

    try {
      const response = await fetch("/api/detect-apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Verbindung zum Shop konnte nicht hergestellt werden.");
      }

      setResult(data.data as AppDetectionResult);
    } catch (err: any) {
      console.warn("App Detector API Error:", err);
      setErrorMsg(
        err.message ||
          "Der Shop konnte nicht automatisch analysiert werden. Nutze bitte die manuelle Quelltext-Eingabe unten."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualAnalyze = async () => {
    if (!manualHtml.trim()) {
      setErrorMsg("Bitte füge den Seitenquelltext ein.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setSelectedCategory("all");

    try {
      const cleanUrl = sanitizeUrl(urlInput || "https://shopify-manual-app-check.myshopify.com");
      const response = await fetch("/api/detect-apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl,
          html: manualHtml,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Fehler bei der Quelltext-Auswertung.");
      }

      setResult(data.data as AppDetectionResult);
      setManualSourceMode(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Fehler beim Analysieren des Quelltextes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = () => {
    if (!result) return;
    const appList = result.detectedApps.map((a) => `• ${a.name} (${a.category})`).join("\n");
    const text = `Shopify App Analyse für ${result.domain}:
Shop: ${result.storeName || result.domain}
Shopify Store: ${result.isShopify ? "Ja" : "Nein"}
Anzahl gefundener Apps: ${result.totalAppsCount}

Erkannte Apps & Tools:
${appList || "Keine Drittanbieter-Apps im Quelltext erkannt"}

Analysiert mit Procware Shopify App Detector: https://procware.de/shopify-app-detector`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter apps based on category selection
  const filteredApps = useMemo(() => {
    if (!result) return [];
    if (selectedCategory === "all") return result.detectedApps;
    return result.detectedApps.filter((a) => a.category === selectedCategory);
  }, [result, selectedCategory]);

  const categories = useMemo(() => {
    if (!result || !result.detectedApps) return [];
    const cats = Array.from(new Set(result.detectedApps.map((a) => a.category)));
    return cats.sort();
  }, [result]);

  return (
    <div className={hideSeoContent ? "bg-white text-slate-900 rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-xs" : "bg-white text-slate-900 min-h-screen pt-24 sm:pt-28 pb-20"}>
      {/* Main Detector Tool Section */}
      <section className={hideSeoContent ? "max-w-5xl mx-auto" : "max-w-5xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-16"}>
        {/* Language Switcher */}
        {!hideSeoContent && (
          <div className="flex justify-center mb-6">
            <ToolLanguageSwitcher toolKey="appDetector" currentLang={currentLang} />
          </div>
        )}

        {/* Header & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Shopify App Detector
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {currentLang === "en"
              ? "Discover which apps, marketing plugins, and conversion tracking pixels any competitor's Shopify store is running in real time."
              : "Finde heraus, welche Apps, Tracking-Pixel und Marketing-Tools jeder beliebige Shopify Store nutzt. Kostenlose Echtzeit-Analyse der gesamten E-Commerce Tech-Stack."}
          </p>
        </div>

        {/* Minimalist URL Input Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Shopify Store Domain oder URL eingeben:
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex items-center">
              <Globe className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDetect()}
                placeholder="z.B. snocks.com oder https://gymshark.com"
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-300 focus:border-slate-900 rounded-2xl text-sm sm:text-base font-medium text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
              {urlInput && (
                <button
                  onClick={() => setUrlInput("")}
                  className="p-1.5 text-slate-400 hover:text-slate-700 absolute right-3 rounded-lg cursor-pointer"
                  title="Eingabe leeren"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleDetect()}
              disabled={isLoading}
              className="px-8 py-3.5 bg-slate-950 hover:bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Scanne Apps...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Apps erkennen</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMsg}</span>
                <div className="mt-2">
                  <button
                    onClick={() => setManualSourceMode(true)}
                    className="font-bold underline text-amber-900 hover:text-amber-950 cursor-pointer"
                  >
                    Quelltext manuell analysieren (Strg + U) →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Store Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3 text-xs text-slate-500">
            {competitors && competitors.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-900">Aus Competitors wählen:</span>
                {competitors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setUrlInput(c.domain);
                      handleDetect(c.domain);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition-colors cursor-pointer text-[11px]"
                  >
                    {c.name} ({c.domain})
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-700">Schnell-Test:</span>
                {["snocks.com", "gymshark.com", "waterdrop.de", "purelei.com"].map((store) => (
                  <button
                    key={store}
                    onClick={() => {
                      setUrlInput(store);
                      handleDetect(store);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    {store}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setManualSourceMode(!manualSourceMode)}
                className="text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{manualSourceMode ? "Quelltext-Eingabe schließen" : "Quelltext manuell einfügen"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Manual Source Inspection Fallback Mode */}
        {manualSourceMode && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">
                  Direkte Quelltext-Analyse (CORS & Cloudflare Bypass)
                </span>
              </div>
              <button
                onClick={() => setManualSourceMode(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-semibold cursor-pointer"
              >
                Ausblenden ✕
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Drücke im gewünschten Shopify Shop einfach <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Strg + U</kbd> (Mac: <kbd className="px-1.5 py-0.5 bg-white border rounded font-mono">Cmd + Alt + U</kbd>), kopiere den HTML-Code und füge ihn hier ein:
            </p>
            <textarea
              rows={5}
              value={manualHtml}
              onChange={(e) => setManualHtml(e.target.value)}
              placeholder="<html><head>... scripts, pixels and apps ...</head></html>"
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            <button
              onClick={handleManualAnalyze}
              disabled={isLoading}
              className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {isLoading ? "Werte Quelltext aus..." : "Apps aus Quelltext filtern"}
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* DETECTION RESULT CARD */}
        {/* ========================================================= */}
        {result && (
          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300 space-y-8">
            {/* Header Result Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                {result.storeFavicon ? (
                  <img
                    src={result.storeFavicon}
                    alt=""
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                    className="w-10 h-10 rounded-2xl bg-white border border-slate-200 p-1.5 object-contain"
                  />
                ) : (
                  <div className={`p-2.5 rounded-2xl ${result.isShopify ? "bg-emerald-600 text-white" : "bg-slate-700 text-white"}`}>
                    <Store className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-black text-slate-950">
                      {result.storeName || result.domain}
                    </span>
                    <a
                      href={result.finalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-blue-600 font-mono flex items-center gap-1"
                    >
                      <span>({result.domain})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {result.isShopify ? (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs font-bold">
                        ✓ Verifizierter Shopify Store
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-rose-50 text-rose-700 border-rose-300 text-xs font-bold">
                        {result.alternativePlatform || "Kein Shopify Store"}
                      </Badge>
                    )}

                    <span className="text-[11px] font-bold text-slate-800 px-2 py-0.5 rounded-md bg-white border border-slate-200">
                      {result.totalAppsCount} Apps & Tools erkannt
                    </span>

                    {result.themeSnippet && (
                      <Link
                        to={`/shopify-theme-detector`}
                        className="text-[11px] font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
                        title="Theme im Theme Detector analysieren"
                      >
                        <span>Theme: {result.themeSnippet.name}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyResult}
                className="self-start sm:self-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? "Kopiert!" : "App-Liste kopieren"}</span>
              </button>
            </div>

            {/* Apps Content Section */}
            {result.isShopify ? (
              <div className="space-y-6">
                {/* Category Filter Bar */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      Filter:
                    </span>
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedCategory === "all"
                          ? "bg-slate-950 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Alle ({result.totalAppsCount})
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-slate-950 text-white shadow-xs"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {cat} ({result.categoryCounts[cat] || 0})
                      </button>
                    ))}
                  </div>
                )}

                {/* Detected Apps Grid */}
                {filteredApps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredApps.map((app, index) => (
                      <div
                        key={index}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-black text-base text-slate-950 group-hover:text-blue-600 transition-colors">
                              {app.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold shrink-0">
                              {app.category}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {app.description}
                          </p>
                        </div>

                        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-semibold text-slate-500">
                            {app.pricing}
                          </span>

                          <div className="flex items-center gap-2">
                            {app.shopifyAppStoreUrl && (
                              <a
                                href={app.shopifyAppStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 text-[11px]"
                                title="Im Shopify App Store ansehen"
                              >
                                <span>App Store</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {app.website && (
                              <a
                                href={app.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-slate-700"
                                title="Website öffnen"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-2">
                    <p className="text-sm font-bold text-slate-900">
                      Keine Drittanbieter-Apps in dieser Kategorie gefunden.
                    </p>
                    <p className="text-xs text-slate-500">
                      Entweder nutzt der Shop keine Tools aus diesem Bereich oder sie werden serverseitig geladen.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-xl font-black text-slate-950">
                  {result.alternativePlatform || "Kein Shopify-System gefunden"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Die eingegebene Website verwendet vermutlich WooCommerce, Shopware, Magento oder eine eigene Webanwendung.
                  Unser App Detector ist auf Shopify-Apps spezialisiert.
                </p>
              </div>
            )}

            {/* Detection Audit Signals Log */}
            {result.detectionSignals && result.detectionSignals.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1.5">Gefundene Quellcode-Signaturen:</span>
                <ul className="space-y-1 text-slate-600">
                  {result.detectionSignals.slice(0, 10).map((sig, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{sig}</span>
                    </li>
                  ))}
                  {result.detectionSignals.length > 10 && (
                    <li className="text-slate-400 italic pt-1">
                      ... sowie {result.detectionSignals.length - 10} weitere Signaturen nachgewiesen.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* RICH SEO KNOWLEDGE CONTENT: "SHOPIFY APP DETECTOR" */}
      {/* ========================================================= */}
      {!hideSeoContent && (
        <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
          {/* SEO Heading Intro */}
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase tracking-wider">
              E-Commerce Tech-Stack Guide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Was ist ein Shopify App Detector und wie funktioniert er?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Ein <strong>Shopify App Detector</strong> ist ein Analyse-Werkzeug, mit dem Händler, E-Commerce-Manager und Entwickler die installierten Plugins, Marketing-Automationen und Drittanbieter-Tools eines beliebigen Shopify Stores identifizieren können. Jede installierte App hinterlässt typische Fingerabdrücke im HTML-Quellcode, in JavaScript-Bundles, CSS-Klassen oder Netzwerkaufrufen.
            </p>
          </div>

          {/* 5 Core App Categories */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Die 5 wichtigsten Shopify App-Kategorien erfolgreicher Marken
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Moderne D2C-Brands setzen auf einen hochspezialisierten Tech-Stack, um Conversion Rates, durchschnittliche Warenkorbwerte (AOV) und Wiederkaufraten zu maximieren:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-sm font-bold text-slate-950">E-Mail & SMS Retention</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tools wie <strong>Klaviyo</strong> oder <strong>Omnisend</strong> generieren oft 30–45% des Gesamtumsatzes durch automatisierte Warenkorb-Abbrecher-Mails, Post-Purchase-Flows und personalisierte Segmente.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-sm font-bold text-slate-950">Social Proof & Reviews</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apps wie <strong>Judge.me</strong>, <strong>Loox</strong> oder <strong>Yotpo</strong> sammeln Kundenbewertungen mit Fotos und Videos, die das Vertrauen neuer Besucher schlagartig erhöhen.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h4 className="text-sm font-bold text-slate-950">Upselling & Cross-Selling</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mit Lösungen wie <strong>Rebuy Engine</strong> oder <strong>ReConvert</strong> werden Kunden im Warenkorb und auf der Danke-Seite passende Zusatzartikel angeboten, was den Warenkorbwert signifikant steigert.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h4 className="text-sm font-bold text-slate-950">Kundenservice & Helpdesk</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Gorgias</strong> oder <strong>Tidio</strong> verknüpfen Kundenanfragen direkt mit Bestelldaten aus Shopify, sodass Support-Tickets in Sekundenschnelle bearbeitet werden können.
                </p>
              </div>
            </div>
          </div>

          {/* 3 Step Manual Guide */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              So erkennst du installierte Shopify Apps manuell
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Falls du eine bestimmte Funktion in einem Store siehst und wissen möchtest, welche App dahintersteckt:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-950">Element untersuchen</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rechtsklicke auf das gewünschte Element (z. B. Bewertungssterne, Pop-up oder Chat-Button) und wähle <em>"Untersuchen"</em> (DevTools).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-950">Klassennamen prüfen</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Achte auf HTML-Klassen oder IDs wie <code className="text-blue-600 font-mono font-bold">jdgm-widget</code> (Judge.me), <code className="text-blue-600 font-mono font-bold">klaviyo-form</code> oder <code className="text-blue-600 font-mono font-bold">gorgias-chat-container</code>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-bold text-slate-950">Netzwerk-Tab checken</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Im DevTools-Reiter <em>"Netzwerk"</em> nach Skripten filtern. Dort siehst du sofort externe Anfragen an Server wie <code className="font-mono text-emerald-700 font-bold">static.klaviyo.com</code> oder <code className="font-mono text-emerald-700 font-bold">rebuyengine.com</code>.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="space-y-6 pt-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Häufig gestellte Fragen (FAQ) zum Shopify App Detector
            </h3>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-950 mb-1.5">
                  Kann der Shopify App Detector ausnahmslos jede installierte App erkennen?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Der Detektor erkennt alle Apps, die clientseitigen Code (JavaScript, CSS, Web-Pixels, iFrames oder DOM-Container) in den Online-Store einbetten. Reine Backend-Apps (z. B. interne Buchhaltungs-Tools oder ERP-Schnittstellen ohne Frontend-Sichtbarkeit) können aus Sicherheitsgründen nicht von außen ausgelesen werden.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-950 mb-1.5">
                  Verlangsamen zu viele Apps meinen Shopify Store?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ja. Jedes zusätzliche Skript erhöht die Ladezeit (Core Web Vitals wie LCP und INP). Mit modernen Shopify Online Store 2.0 <em>App-Embeds</em> ist der Einfluss zwar geringer als früher, dennoch empfiehlt es sich, ungenutzte Apps konsequent zu deinstallieren und Skripte zu bereinigen.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-950 mb-1.5">
                  Ist die App-Erkennung für jeden Shop legal?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ja. Der Detector wertet ausschließlich öffentlich zugängliche HTML- und JavaScript-Dateien aus, die jeder Browser beim Laden der Website ohnehin empfängt.
                </p>
              </div>
            </div>
          </div>

          {/* Procware CTA Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-black text-blue-400 tracking-wider uppercase">
                Procware Supply Chain & E-Commerce
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Gute Apps bringen Kunden – wir sichern deine Produktmargen
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Als führender Partner für Sourcing, Qualitätskontrolle und Direktexport aus Asien
                helfen wir europäischen Marken, erstklassige Produkte zu unschlagbaren Konditionen zu beschaffen.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Kostenloses Erstgespräch vereinbaren
            </button>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
