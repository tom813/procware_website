import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  ArrowRight,
  Code2,
  RefreshCw,
  X,
  FileCode,
  Tag,
  Store,
  Calendar,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useCompetitors } from "../context/CompetitorContext";
import {
  ThemeDetectionResult,
  ShopifyThemeInfo,
  DetectedApp,
  SHOPIFY_THEME_CATALOG,
  KNOWN_EXTERNAL_THEMES,
} from "../data/shopifyThemesData";

interface ShopifyThemeDetectorPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
  hideSeoContent?: boolean;
}

export const ShopifyThemeDetectorPage: React.FC<ShopifyThemeDetectorPageProps> = ({
  onOpenBooking,
  lang: propLang,
  hideSeoContent = false,
}) => {
  const location = useLocation();
  const { competitors } = useCompetitors();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    if (!hideSeoContent) {
      applyToolSeo("themeDetector", currentLang);
      window.scrollTo(0, 0);
    }
  }, [currentLang, hideSeoContent]);

  const [urlInput, setUrlInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ThemeDetectionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [manualSourceMode, setManualSourceMode] = useState<boolean>(false);
  const [manualHtml, setManualHtml] = useState<string>("");

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

    const cleanUrl = sanitizeUrl(rawTarget);

    try {
      const response = await fetch("/api/detect-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Verbindung zum Shop konnte nicht hergestellt werden.");
      }

      setResult(data.data as ThemeDetectionResult);
    } catch (err: any) {
      console.warn("API Error:", err);
      setErrorMsg(
        err.message ||
          "Der Shop konnte nicht automatisch analysiert werden. Nutze bitte die Quelltext-Analyse unten."
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

    try {
      const cleanUrl = sanitizeUrl(urlInput || "https://shopify-manual-check.myshopify.com");
      const response = await fetch("/api/detect-theme", {
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

      setResult(data.data as ThemeDetectionResult);
      setManualSourceMode(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Fehler beim Analysieren des Quelltextes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResult = () => {
    if (!result) return;
    const text = `Shopify Theme Analyse für ${result.domain}:
Shop: ${result.storeName || result.domain}
Shopify Store: ${result.isShopify ? "Ja" : "Nein"}
Theme: ${result.theme?.name || "Kein Shopify Theme"}
Theme Store ID: ${result.theme?.themeStoreId || "Keine"}
OS Version: ${result.shopifyInfo?.isOnlineStore20 ? "Online Store 2.0" : "Vintage"}
Installierte Apps: ${result.detectedApps.map((a) => a.name).join(", ") || "Keine erkannt"}
Analysiert mit Procware Shopify Theme Detector: https://procware.de/shopify-theme-detector`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={hideSeoContent ? "bg-white text-slate-900 rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-xs" : "bg-white text-slate-900 min-h-screen pt-24 sm:pt-28 pb-20"}>
      {/* Main Detector Tool Section */}
      <section className={hideSeoContent ? "max-w-5xl mx-auto" : "max-w-5xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4 pb-16"}>
        {/* Language Switcher */}
        {!hideSeoContent && (
          <div className="flex justify-center mb-6">
            <ToolLanguageSwitcher toolKey="themeDetector" currentLang={currentLang} />
          </div>
        )}

        {/* Header & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Shopify Theme Detector
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            {currentLang === "en"
              ? "Enter any Shopify store URL to detect its active theme, developer details, Online Store 2.0 status, and installed apps in real time."
              : "Trage einfach die URL eines beliebigen Shopify-Shops ein. Unser System erkennt das verwendete Theme, Entwickler-Informationen und installierte Apps in Echtzeit."}
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
                  <span>Analysiere Store...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Theme erkennen</span>
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
                    Quelltext manuell eingeben (Strg + U) →
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
              placeholder="<html><head>... Shopify.theme = {...} ...</head></html>"
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            <button
              onClick={handleManualAnalyze}
              disabled={isLoading}
              className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {isLoading ? "Werte Quelltext aus..." : "Quelltext auswerten"}
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
                      // fallback to icon
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
                    <span className="text-sm sm:text-base font-black text-slate-900">
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

                    {result.shopifyInfo?.isOnlineStore20 && (
                      <span className="text-[11px] font-bold text-slate-600 px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        Online Store 2.0
                      </span>
                    )}

                    {result.shopifyInfo?.currency && (
                      <span className="text-[11px] font-mono text-slate-500">
                        Währung: {result.shopifyInfo.currency}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyResult}
                className="self-start sm:self-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? "Kopiert!" : "Ergebnis kopieren"}</span>
              </button>
            </div>

            {/* Primary Theme Highlight Box */}
            {result.isShopify && result.theme ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Theme Info (Col 2) */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider border border-blue-200">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Erkanntes Shopify Theme</span>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                          {result.theme.cleanName}
                        </h2>
                        {result.theme.isCustomized && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                            Modifiziert / Umbenannt
                          </span>
                        )}
                      </div>

                      {result.theme.name !== result.theme.cleanName && (
                        <p className="text-xs text-slate-500 font-mono mt-1">
                          Aktiver Name im Code: "{result.theme.name}"
                        </p>
                      )}

                      {result.theme.details && (
                        <p className="text-xs text-slate-500 font-bold mt-1.5">
                          Entwickler: <span className="text-slate-900">{result.theme.details.author}</span> • Kategorie: {result.theme.details.category}
                        </p>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {result.theme.details?.description ||
                        "Dieses Theme wurde für diesen Store maßgeschneidert entwickelt oder basiert auf einem Agentur-Framework."}
                    </p>

                    {result.theme.details?.features && (
                      <div className="pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Wichtige Theme-Merkmale:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                          {result.theme.details.features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.theme.details?.officialUrl && (
                      <div className="pt-3">
                        <a
                          href={result.theme.details.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold transition-colors"
                        >
                          <span>Theme im offiziellen Store ansehen</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Pricing & Technical Metadata Card (Col 1) */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase font-bold text-[10px] block">Theme-Preis</span>
                      <span className="text-lg font-black text-slate-950">
                        {result.theme.details?.price || (result.theme.themeStoreId ? "Theme Store Lizenz" : "Individuelle Entwicklung")}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-slate-400 uppercase font-bold text-[10px] block">Theme-Architektur</span>
                      <span className="font-bold text-slate-800">
                        {result.theme.isCustomTheme ? "Maßgeschneidert (Custom Theme)" : "Shopify Theme Store Partner"}
                      </span>
                    </div>

                    {result.theme.themeStoreId && (
                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">Theme Store ID</span>
                        <span className="font-mono font-bold text-blue-700">#{result.theme.themeStoreId}</span>
                      </div>
                    )}

                    {result.theme.themeId && (
                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">Interne Store-ID</span>
                        <span className="font-mono font-bold text-slate-800">{result.theme.themeId}</span>
                      </div>
                    )}

                    {result.theme.version && (
                      <div className="pt-3 border-t border-slate-200">
                        <span className="text-slate-400 uppercase font-bold text-[10px] block">Version</span>
                        <span className="font-bold text-slate-800">v{result.theme.version}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-slate-400 uppercase font-bold text-[10px] block">Technologie</span>
                      <span className="font-bold text-emerald-700">
                        {result.shopifyInfo?.isOnlineStore20 ? "Online Store 2.0 (JSON Sections)" : "Vintage Liquid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h3 className="text-xl font-black text-slate-950">
                  {result.alternativePlatform || "Kein Shopify-System gefunden"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Die eingegebene Website verwendet vermutlich ein anderes Shopsystem wie WooCommerce,
                  Shopware, Magento oder eine individuelle Webanwendung.
                </p>
              </div>
            )}

            {/* Detected Shopify Apps Section */}
            {result.isShopify && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <h3 className="text-lg font-black text-slate-950">
                      Erkannte Shopify Apps & Marketing Tools ({result.detectedApps.length})
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Automatische Quelltext-Signatur</span>
                </div>

                {result.detectedApps.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {result.detectedApps.map((app, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-sm text-slate-900">{app.name}</span>
                          {app.website && (
                            <a
                              href={app.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-blue-600"
                              title="Offizielle App-Website"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium mt-1">{app.category}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-3">
                    Keine gängigen Drittanbieter-Apps im öffentlichen Quelltext sichtbar (möglicherweise headless oder serverseitig integriert).
                  </p>
                )}
              </div>
            )}

            {/* Detection Signals Audit Log */}
            {result.detectionSignals && result.detectionSignals.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-1.5">Erkennungs-Signale (Audit Trail):</span>
                <ul className="space-y-1 text-slate-600">
                  {result.detectionSignals.map((sig, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* RICH SEO KNOWLEDGE CONTENT: "SHOPIFY THEME DETECTOR" */}
      {/* ========================================================= */}
      {!hideSeoContent && (
        <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
          {/* SEO Heading Intro */}
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase tracking-wider">
              Ratgeber & Technischer Guide
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Wie funktioniert ein Shopify Theme Detector?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Jeder Shopify Store hinterlässt im Browser eindeutige Fingerabdrücke. Unser Detektor analysiert
              den Quellcode, CDN-Verweise, Skript-Tags sowie das JavaScript-Objekt{" "}
              <code className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-xs font-bold text-slate-900">
                window.Shopify.theme
              </code>
              , um herauszufinden, auf welchem Basis-Theme der Shop aufbaut und welche Apps aktiv sind.
            </p>
          </div>

          {/* 3 Step Manual Guide */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              So findest du das Shopify Theme manuell heraus
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Falls du das Theme eines Shops ohne Tool manuell prüfen möchtest, kannst du das in unter 30 Sekunden mit deinen Browser-Entwicklertools erledigen:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-950">Quelltext öffnen</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Öffne den gewünschten Shop und drücke auf deiner Tastatur <kbd className="px-1 py-0.5 bg-slate-100 border rounded font-mono">Strg + U</kbd> (bzw. <kbd className="px-1 py-0.5 bg-slate-100 border rounded font-mono">Cmd + Alt + U</kbd> auf dem Mac).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-950">Nach "Shopify.theme" suchen</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Drücke <kbd className="px-1 py-0.5 bg-slate-100 border rounded font-mono">Strg + F</kbd> und tippe <code className="text-blue-600 font-mono font-bold">Shopify.theme</code> ein.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <span className="w-7 h-7 rounded-xl bg-slate-950 text-white font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-bold text-slate-950">Name & ID ablesen</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dort findest du einen JSON-Block mit <code className="font-mono text-[11px] text-emerald-700 font-bold">"name"</code> und <code className="font-mono text-[11px] text-emerald-700 font-bold">"theme_store_id"</code>. Ist die ID bekannt, stammt es direkt aus dem offiziellen Store.
                </p>
              </div>
            </div>
          </div>

          {/* Popular Shopify Themes Comparison Table */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Die beliebtesten Shopify Themes im Vergleich
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Erfolgreiche E-Commerce Brands setzen fast ausnahmslos auf eines der folgenden Flaggschiff-Themes:
            </p>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3.5">Theme</th>
                      <th className="p-3.5">Hersteller</th>
                      <th className="p-3.5">Preis</th>
                      <th className="p-3.5">Ideale Nische</th>
                      <th className="p-3.5">Besonderheit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-3.5 font-bold text-slate-900">Dawn</td>
                      <td className="p-3.5">Shopify</td>
                      <td className="p-3.5 text-emerald-700 font-bold">Kostenlos</td>
                      <td className="p-3.5">Allrounder / Starter</td>
                      <td className="p-3.5">Offizielles OS 2.0 Benchmark-Theme, minimaler Ballast</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-slate-900">Impulse</td>
                      <td className="p-3.5">Archetype</td>
                      <td className="p-3.5 font-bold">380 USD</td>
                      <td className="p-3.5">Fashion & Sport</td>
                      <td className="p-3.5">Starke Kollektionsfilter & Promotion-Banner</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-slate-900">Prestige</td>
                      <td className="p-3.5">Maestrooo</td>
                      <td className="p-3.5 font-bold">380 USD</td>
                      <td className="p-3.5">Beauty, Luxury & Schmuck</td>
                      <td className="p-3.5">Herausragende Magazin-Ästhetik & Storytelling</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-slate-900">Warehouse</td>
                      <td className="p-3.5">Maestrooo</td>
                      <td className="p-3.5 font-bold">320 USD</td>
                      <td className="p-3.5">Elektronik & Große Kataloge</td>
                      <td className="p-3.5">Extrem schnelle Facettensuche und Bestandsanzeigen</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-slate-900">Motion</td>
                      <td className="p-3.5">Archetype</td>
                      <td className="p-3.5 font-bold">360 USD</td>
                      <td className="p-3.5">Lifestyle & Produkte mit Videos</td>
                      <td className="p-3.5">Sanfte Video-Hintergründe & flüssige Micro-Animations</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="space-y-6 pt-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950">
              Häufig gestellte Fragen (FAQ) zum Shopify Theme Detector
            </h3>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-950 mb-1.5">
                  Warum kann der Detector manche Shopify Themes nicht erkennen?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Größere Marken lassen ihre Themes oft von Entwickler-Agenturen maßschneidern oder das
                  Basis-Theme wird vollständig umbenannt. Manche Stores laufen auch "Headless" (z.B. mit Next.js oder Hydrogen), wodurch das klassische Shopify-Liquid-Theme gar nicht im Browser gerendert wird.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-950 mb-1.5">
                  Kann man ein erkanntes Shopify Theme einfach kopieren?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Nein. Das Tool verrät dir den Namen und die Bezugsquelle des Themes. Um es für deinen eigenen Shop zu nutzen, musst du die reguläre Lizenz im offiziellen Shopify Theme Store erwerben.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="text-sm sm:text-base font-bold text-slate-950 mb-1.5">
                  Ist die Nutzung dieses Tools 100% kostenlos?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Ja, der Procware Shopify Theme Detector ist uneingeschränkt kostenlos und ohne Registrierung nutzbar.
                </p>
              </div>
            </div>
          </div>

          {/* Procware CTA Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-black text-blue-400 tracking-wider uppercase">
                Procware E-Commerce Excellence
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Möchtest du deinen Shopify Store skalieren oder optimieren?
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Wir unterstützen E-Commerce Marken bei der Produktbeschaffung, Qualitätsprüfung,
                Zollabwicklung und schnellen Lieferketten aus China.
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              Kostenloses Erstgespräch buchen
            </button>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
