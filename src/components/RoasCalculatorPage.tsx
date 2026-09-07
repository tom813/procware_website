import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import {
  TrendingUp,
  Calculator,
  Percent,
  Euro,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  BarChart2,
  Calendar,
  Layers,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  Sliders,
  Scale,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface RoasCalculatorPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
}

export const RoasCalculatorPage: React.FC<RoasCalculatorPageProps> = ({
  onOpenBooking,
  lang: propLang,
}) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    applyToolSeo("roasCalculator", currentLang);
    window.scrollTo(0, 0);
  }, [currentLang]);

  // Mode: simple (Ad Spend + Revenue) or detailed (CPC + Clicks + CR + AOV)
  const [inputMode, setInputMode] = useState<"simple" | "traffic">("simple");
  const [tableTab, setTableTab] = useState<"roas" | "budget" | "margin">("roas");

  // Simple state
  const [adSpend, setAdSpend] = useState<number>(4500);
  const [adRevenue, setAdRevenue] = useState<number>(18000);

  // Traffic state
  const [cpc, setCpc] = useState<number>(0.90);
  const [clicks, setClicks] = useState<number>(5000);
  const [conversionRate, setConversionRate] = useState<number>(2.5); // %
  const [aov, setAov] = useState<number>(72); // €

  // Margin for POAS
  const [productCostPercent, setProductCostPercent] = useState<number>(38); // COGS + Shipping = 38%
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const calculated = useMemo(() => {
    let effectiveSpend = adSpend;
    let effectiveRevenue = adRevenue;
    let orders = 0;

    if (inputMode === "traffic") {
      effectiveSpend = clicks * cpc;
      orders = clicks * (conversionRate / 100);
      effectiveRevenue = orders * aov;
    } else {
      orders = aov > 0 ? Math.round(effectiveRevenue / aov) : 0;
    }

    const roas = effectiveSpend > 0 ? effectiveRevenue / effectiveSpend : 0;
    const acos = effectiveRevenue > 0 ? (effectiveSpend / effectiveRevenue) * 100 : 0;

    // Gross Margin & Cost calculations
    const grossMarginPercent = Math.max(0, 100 - productCostPercent);
    const productCost = effectiveRevenue * (productCostPercent / 100);
    const grossProfitBeforeAds = effectiveRevenue - productCost;
    const netProfitAfterAds = grossProfitBeforeAds - effectiveSpend;
    const poas = effectiveSpend > 0 ? grossProfitBeforeAds / effectiveSpend : 0;
    const netMarginPercent = effectiveRevenue > 0 ? (netProfitAfterAds / effectiveRevenue) * 100 : 0;

    // Break-Even Metrics
    const breakEvenRoas = grossMarginPercent > 0 ? 100 / grossMarginPercent : 0;
    const breakEvenAcos = grossMarginPercent;
    const roasBuffer = roas - breakEvenRoas;

    // Per order metrics
    const cpa = orders > 0 ? effectiveSpend / orders : 0;
    const profitPerOrder = orders > 0 ? netProfitAfterAds / orders : 0;
    const roiOnAdSpend = effectiveSpend > 0 ? (netProfitAfterAds / effectiveSpend) * 100 : 0;

    return {
      effectiveSpend,
      effectiveRevenue,
      orders: Math.round(orders),
      roas,
      acos,
      grossMarginPercent,
      productCost,
      grossProfitBeforeAds,
      netProfitAfterAds,
      netMarginPercent,
      poas,
      breakEvenRoas,
      breakEvenAcos,
      roasBuffer,
      cpa,
      profitPerOrder,
      roiOnAdSpend,
    };
  }, [inputMode, adSpend, adRevenue, cpc, clicks, conversionRate, aov, productCostPercent]);

  const getRoasBenchmark = (roas: number) => {
    if (roas < 1.5) {
      return {
        label: "Kritisch / Verlust",
        badge: "bg-red-50 text-red-700 border-red-200",
        desc: "Kampagnen verbrennen Werbebudget. Sourcing & Angebot überarbeiten.",
      };
    }
    if (roas < 2.5) {
      return {
        label: "Break-Even Grenzbereich",
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        desc: "Deckung der direkten Kosten, aber kaum Spielraum für Reingewinn.",
      };
    }
    if (roas < 4.0) {
      return {
        label: "Solider E-Commerce Standard",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        desc: "Rentabler Betrieb für die meisten Shopify DTC Brands.",
      };
    }
    return {
      label: "Exzellent / Hochprofitabel",
      badge: "bg-blue-50 text-blue-700 border-blue-200",
      desc: "Hervorragende Performance! Bereit zur Skalierung des Werbebudgets.",
    };
  };

  const benchmark = getRoasBenchmark(calculated.roas);

  const handleCopy = () => {
    const text = `Procware ROAS Analyse:
• Werbebudget: ${calculated.effectiveSpend.toFixed(2)} €
• Erzielter Umsatz: ${calculated.effectiveRevenue.toFixed(2)} €
---
• ROAS: ${calculated.roas.toFixed(2)}x (${(calculated.roas * 100).toFixed(0)}%)
• POAS (Profit on Ad Spend): ${calculated.poas.toFixed(2)}x
• ACOS: ${calculated.acos.toFixed(2)}%
• Reingewinn nach Werbe- & Warenkosten: ${calculated.netProfitAfterAds.toFixed(2)} €
Berechnet mit https://procware.io/roas-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top utility row with Breadcrumb and discreet Top-Right Language Switcher */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <span>←</span>
              <span>{currentLang === "en" ? "All E-Com Tools" : "Alle Tools"}</span>
            </Link>
            <div className="flex items-center gap-2">
              <ToolLanguageSwitcher toolKey="roasCalculator" currentLang={currentLang} />
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentLang === "en" ? "Performance Marketing Calculator" : "Performance Marketing Rechner"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              ROAS <span className="text-blue-600">Calculator</span> & {currentLang === "en" ? "POAS Estimator" : "Rechner"}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {currentLang === "en"
                ? "Calculate Return on Ad Spend (ROAS), Profit on Ad Spend (POAS), and campaign net profit for Meta, TikTok & Google Ads in seconds."
                : "Ermittle in Sekunden deinen Return on Ad Spend (ROAS), deinen POAS (Profit on Ad Spend) und den Werbegewinn für deine Meta Ads, Google Shopping und TikTok Kampagnen."}
            </p>

            {/* Mode switch */}
            <div className="mt-6 flex bg-white p-1 rounded-2xl border border-slate-200 w-fit">
              <button
                onClick={() => setInputMode("simple")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  inputMode === "simple"
                    ? "bg-slate-950 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Einfach (Ad Spend & Umsatz)
              </button>
              <button
                onClick={() => setInputMode("traffic")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  inputMode === "traffic"
                    ? "bg-slate-950 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Traffic-Modell (Klicks, CPC & CR)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Tool */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-black text-slate-950 pb-4 border-b border-slate-100 flex items-center justify-between">
              <span>Werbe-Kennzahlen eingeben</span>
              <button
                onClick={() => {
                  setAdSpend(4500);
                  setAdRevenue(18000);
                  setProductCostPercent(38);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </h2>

            {inputMode === "simple" ? (
              <>
                {/* Ad Spend */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="roas-adspend-input" className="text-sm font-bold text-slate-900">
                      Werbeausgaben (Ad Spend)
                    </label>
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                      <input
                        id="roas-adspend-input"
                        type="number"
                        step="50"
                        min="0"
                        value={adSpend}
                        onChange={(e) => setAdSpend(Math.max(0, Number(e.target.value)))}
                        className="w-24 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                      />
                      <span className="text-xs font-bold text-blue-600">€</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="50000"
                    step="100"
                    value={Math.min(50000, Math.max(100, adSpend))}
                    onChange={(e) => setAdSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>100 €</span>
                    <span>10.000 €</span>
                    <span>50.000 €+ (Freie Eingabe oben)</span>
                  </div>
                </div>

                {/* Ad Revenue */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="roas-revenue-input" className="text-sm font-bold text-slate-900">
                      Erzielter Werbeumsatz (Conversion Value)
                    </label>
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                      <input
                        id="roas-revenue-input"
                        type="number"
                        step="100"
                        min="0"
                        value={adRevenue}
                        onChange={(e) => setAdRevenue(Math.max(0, Number(e.target.value)))}
                        className="w-28 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                      />
                      <span className="text-xs font-bold text-blue-600">€</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="150000"
                    step="500"
                    value={Math.min(150000, Math.max(500, adRevenue))}
                    onChange={(e) => setAdRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>500 €</span>
                    <span>50.000 €</span>
                    <span>150.000 €+ (Freie Eingabe oben)</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Clicks */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="roas-clicks-input" className="text-sm font-bold text-slate-900">Link-Klicks</label>
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                      <input
                        id="roas-clicks-input"
                        type="number"
                        step="50"
                        min="1"
                        value={clicks}
                        onChange={(e) => setClicks(Math.max(1, Number(e.target.value)))}
                        className="w-20 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                      />
                      <span className="text-xs font-bold text-blue-600">Klicks</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="30000"
                    step="250"
                    value={Math.min(30000, Math.max(500, clicks))}
                    onChange={(e) => setClicks(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* CPC */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="roas-cpc-input" className="text-sm font-bold text-slate-900">CPC (Kosten pro Klick)</label>
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                      <input
                        id="roas-cpc-input"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={cpc}
                        onChange={(e) => setCpc(Math.max(0.01, Number(e.target.value)))}
                        className="w-16 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                      />
                      <span className="text-xs font-bold text-blue-600">€</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.10"
                    max="4.00"
                    step="0.05"
                    value={Math.min(4, Math.max(0.1, cpc))}
                    onChange={(e) => setCpc(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Conversion Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="roas-cr-input" className="text-sm font-bold text-slate-900">Conversion Rate</label>
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                      <input
                        id="roas-cr-input"
                        type="number"
                        step="0.1"
                        min="0.01"
                        value={conversionRate}
                        onChange={(e) => setConversionRate(Math.max(0.01, Number(e.target.value)))}
                        className="w-16 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                      />
                      <span className="text-xs font-bold text-blue-600">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={Math.min(6, Math.max(0.5, conversionRate))}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* AOV */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="roas-aov-input" className="text-sm font-bold text-slate-900">Warenkorb (AOV)</label>
                    <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                      <input
                        id="roas-aov-input"
                        type="number"
                        step="0.01"
                        min="1"
                        value={aov}
                        onChange={(e) => setAov(Math.max(1, Number(e.target.value)))}
                        className="w-20 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                      />
                      <span className="text-xs font-bold text-blue-600">€</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="250"
                    step="1"
                    value={Math.min(250, Math.max(20, aov))}
                    onChange={(e) => setAov(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </>
            )}

            {/* Variable Costs / POAS Setting */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="roas-cogs-input" className="text-sm font-bold text-slate-900">
                  Wareneinsatz & Fulfillment (COGS)
                </label>
                <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                  <input
                    id="roas-cogs-input"
                    type="number"
                    step="0.5"
                    min="0"
                    max="95"
                    value={productCostPercent}
                    onChange={(e) => setProductCostPercent(Math.min(95, Math.max(0, Number(e.target.value))))}
                    className="w-16 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                  />
                  <span className="text-xs font-bold text-blue-600">%</span>
                </div>
              </div>
              <input
                type="range"
                min="10"
                max="70"
                step="1"
                value={Math.min(70, Math.max(10, productCostPercent))}
                onChange={(e) => setProductCostPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                <span>Ergibt <strong>{calculated.grossMarginPercent.toFixed(1)}% Bruttomarge</strong></span>
                <span>Break-Even ROAS: <strong>{calculated.breakEvenRoas.toFixed(2)}x</strong></span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Return on Ad Spend (ROAS)
                  </span>
                  <div className="text-5xl font-black text-white mt-1">
                    {calculated.roas.toFixed(2)}x
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    entspricht {(calculated.roas * 100).toFixed(0)}% Werbeeffizienz
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ACOS
                  </span>
                  <div className="text-3xl font-black text-blue-400 mt-1">
                    {calculated.acos.toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-400">Ad Spend / Umsatz</div>
                </div>
              </div>

              {/* Status Box */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Einstufung:</span>
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${benchmark.badge}`}>
                      {benchmark.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{benchmark.desc}</p>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-slate-800 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-slate-400">Reingewinn nach Ads:</div>
                  <div
                    className={`text-base font-black mt-0.5 ${
                      calculated.netProfitAfterAds >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {calculated.netProfitAfterAds >= 0 ? "+" : ""}
                    {calculated.netProfitAfterAds.toFixed(2)} €
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-slate-400">POAS (Profit on Ad Spend):</div>
                  <div className="text-base font-black text-white mt-0.5">
                    {calculated.poas.toFixed(2)}x
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-slate-400">Umsatz:</div>
                  <div className="text-base font-black text-white mt-0.5">
                    {calculated.effectiveRevenue.toFixed(0)} €
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-slate-400">Wareneinsatz & Logistik:</div>
                  <div className="text-base font-black text-slate-300 mt-0.5">
                    -{calculated.productCost.toFixed(0)} €
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-slate-400">Break-Even ROAS:</div>
                  <div className="text-base font-black text-blue-400 mt-0.5">
                    {calculated.breakEvenRoas.toFixed(2)}x
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl">
                  <div className="text-slate-400">ROAS-Puffer / Marge:</div>
                  <div
                    className={`text-base font-black mt-0.5 ${
                      calculated.roasBuffer >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {calculated.roasBuffer >= 0 ? "+" : ""}
                    {calculated.roasBuffer.toFixed(2)}x
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Kopiert!" : "Ergebnis kopieren"}</span>
                </button>
                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{currentLang === "en" ? "Reduce Product Costs with Procware" : "Wareneinsatz senken mit Procware"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Procware Margin Advantage Callout */}
            <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-7 border border-slate-800 shadow-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentLang === "en" ? "Procware Margin Advantage" : "Marge steigern mit Procware"}</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {currentLang === "en"
                  ? "Higher margins require less ROAS and absorb rising ad costs"
                  : "Wer höhere Margen hat, benötigt weniger ROAS und hält steigende Ad-Kosten aus"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentLang === "en"
                  ? "Procware increases your product gross margin by up to 20%–45% via direct factory sourcing without middlemen. With lower COGS, your break-even ROAS drops drastically — allowing you to outbid competitors in Meta & Google Ad auctions while staying highly profitable."
                  : "Procware steigert deine Produktmarge um 20% bis 45% durch direkten Fabrikeinkauf ohne Zwischenhändler. Mit geringerem Wareneinsatz sinkt dein nötiger Break-Even ROAS drastisch – so kannst du im Performance Marketing profitabel skalieren, wo Konkurrenten bereits Verluste schreiben."}
              </p>
              <div className="pt-2">
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-colors shadow-md cursor-pointer"
                >
                  <span>{currentLang === "en" ? "Analyze Sourcing Margin Potential" : "Sourcing-Potenzial analysieren"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Sensitivity Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-950 mb-3 flex items-center justify-between">
                <span>Schnellübersicht ROAS-Szenarien</span>
                <span className="text-xs font-normal text-slate-500">Basis: {calculated.effectiveSpend.toFixed(0)} € Ad Spend</span>
              </h3>
              <div className="space-y-2 text-xs">
                {[1.5, 2.0, 2.5, 3.0, 4.0, 5.0].map((testRoas) => {
                  const testRev = calculated.effectiveSpend * testRoas;
                  const testProfit = testRev * (calculated.grossMarginPercent / 100) - calculated.effectiveSpend;
                  const isCurrent = Math.abs(calculated.roas - testRoas) < 0.25;
                  return (
                    <div
                      key={testRoas}
                      className={`flex items-center justify-between p-2.5 rounded-xl border ${
                        isCurrent
                          ? "bg-blue-50/90 border-blue-300 text-blue-950 font-bold ring-1 ring-blue-300"
                          : "bg-slate-50/60 border-slate-100 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>ROAS {testRoas.toFixed(1)}x</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-md font-bold">
                            Aktuell
                          </span>
                        )}
                      </div>
                      <span>Umsatz: {testRev.toFixed(0)} €</span>
                      <span className={testProfit >= 0 ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                        Gewinn: {testProfit >= 0 ? "+" : ""}
                        {testProfit.toFixed(0)} €
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive ROAS Performance & Profitability Table */}
        <div className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
                <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                <span>E-Commerce Performance Matrix</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                ROAS & Rentabilitätstabelle für Shopify Stores
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Detaillierte Gegenüberstellung aller relevanten Kennzahlen bei {calculated.grossMarginPercent.toFixed(1)}% Bruttomarge ({productCostPercent}% Wareneinsatz).
              </p>
            </div>

            {/* Table Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
              <button
                onClick={() => setTableTab("roas")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tableTab === "roas"
                    ? "bg-white text-slate-950 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                ROAS-Staffel
              </button>
              <button
                onClick={() => setTableTab("budget")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tableTab === "budget"
                    ? "bg-white text-slate-950 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Budget-Skalierung
              </button>
              <button
                onClick={() => setTableTab("margin")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tableTab === "margin"
                    ? "bg-white text-slate-950 shadow-xs border border-slate-200/60"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Break-Even Matrix
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="mt-6 overflow-x-auto">
            {tableTab === "roas" && (
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                    <th className="py-3 px-3">ROAS</th>
                    <th className="py-3 px-3">ROAS %</th>
                    <th className="py-3 px-3">ACOS %</th>
                    <th className="py-3 px-3">Umsatz (€)</th>
                    <th className="py-3 px-3">Wareneinsatz (€)</th>
                    <th className="py-3 px-3">Deckungsbeitrag (€)</th>
                    <th className="py-3 px-3">Reingewinn (€)</th>
                    <th className="py-3 px-3">POAS</th>
                    <th className="py-3 px-3">Nettomarge</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0, 6.0].map((stepRoas) => {
                    const stepRevenue = calculated.effectiveSpend * stepRoas;
                    const stepCogs = stepRevenue * (productCostPercent / 100);
                    const stepGrossProfit = stepRevenue - stepCogs;
                    const stepNetProfit = stepGrossProfit - calculated.effectiveSpend;
                    const stepPoas = calculated.effectiveSpend > 0 ? stepGrossProfit / calculated.effectiveSpend : 0;
                    const stepAcos = (1 / stepRoas) * 100;
                    const stepNetMargin = stepRevenue > 0 ? (stepNetProfit / stepRevenue) * 100 : 0;
                    const isClosest = Math.abs(calculated.roas - stepRoas) < 0.25;
                    const isProfitable = stepNetProfit >= 0;

                    return (
                      <tr
                        key={stepRoas}
                        className={`transition-colors ${
                          isClosest
                            ? "bg-blue-50/80 font-semibold"
                            : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-3 px-3 font-extrabold text-slate-950 flex items-center gap-1.5">
                          <span>{stepRoas.toFixed(2)}x</span>
                          {isClosest && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                              Aktuell
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{(stepRoas * 100).toFixed(0)}%</td>
                        <td className="py-3 px-3 text-slate-600">{stepAcos.toFixed(1)}%</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{stepRevenue.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</td>
                        <td className="py-3 px-3 text-slate-500">-{stepCogs.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</td>
                        <td className="py-3 px-3 text-slate-700">{stepGrossProfit.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</td>
                        <td className={`py-3 px-3 font-bold ${isProfitable ? "text-emerald-600" : "text-red-600"}`}>
                          {isProfitable ? "+" : ""}
                          {stepNetProfit.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{stepPoas.toFixed(2)}x</td>
                        <td className={`py-3 px-3 font-semibold ${stepNetMargin >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {stepNetMargin.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3">
                          {stepRoas < calculated.breakEvenRoas ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              Verlustzone
                            </span>
                          ) : stepRoas - calculated.breakEvenRoas < 0.5 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Grenzbereich
                            </span>
                          ) : stepRoas < 4.0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Profitabel
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              Skalierbar
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {tableTab === "budget" && (
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                    <th className="py-3 px-3">Monatlicher Ad Spend</th>
                    <th className="py-3 px-3">Erwarteter Umsatz ({calculated.roas.toFixed(2)}x ROAS)</th>
                    <th className="py-3 px-3">Geschätzte Orders</th>
                    <th className="py-3 px-3">Wareneinsatz & Logistik</th>
                    <th className="py-3 px-3">Deckungsbeitrag</th>
                    <th className="py-3 px-3">Echter Werbegewinn</th>
                    <th className="py-3 px-3">ROI auf Werbebudget</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1000, 2500, 5000, 10000, 15000, 25000, 50000].map((budget) => {
                    const rev = budget * calculated.roas;
                    const ordersCount = aov > 0 ? Math.round(rev / aov) : 0;
                    const cogs = rev * (productCostPercent / 100);
                    const gross = rev - cogs;
                    const net = gross - budget;
                    const roi = budget > 0 ? (net / budget) * 100 : 0;
                    const isClosest = Math.abs(calculated.effectiveSpend - budget) < budget * 0.3;

                    return (
                      <tr
                        key={budget}
                        className={`transition-colors ${
                          isClosest ? "bg-blue-50/80 font-semibold" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-3 px-3 font-extrabold text-slate-950 flex items-center gap-1.5">
                          <span>{budget.toLocaleString("de-DE")} €</span>
                          {isClosest && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                              Aktuell
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">{rev.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</td>
                        <td className="py-3 px-3 text-slate-600">{ordersCount.toLocaleString("de-DE")}</td>
                        <td className="py-3 px-3 text-slate-500">-{cogs.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</td>
                        <td className="py-3 px-3 text-slate-700">{gross.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €</td>
                        <td className={`py-3 px-3 font-bold ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {net >= 0 ? "+" : ""}
                          {net.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
                        </td>
                        <td className={`py-3 px-3 font-semibold ${roi >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                          {roi.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3">
                          {net >= 0 ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Gewinnbringend
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              Verlustbehaftet
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {tableTab === "margin" && (
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                    <th className="py-3 px-3">Bruttomarge %</th>
                    <th className="py-3 px-3">Wareneinsatz %</th>
                    <th className="py-3 px-3">Break-Even ROAS</th>
                    <th className="py-3 px-3">Max. Break-Even ACOS</th>
                    <th className="py-3 px-3">Ziel-ROAS für 15% Reingewinn</th>
                    <th className="py-3 px-3">Ziel-ROAS für 25% Reingewinn</th>
                    <th className="py-3 px-3">Kommentar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[20, 30, 40, 50, 60, 65, 70, 75, 80].map((marginVal) => {
                    const cogsVal = 100 - marginVal;
                    const beRoas = 100 / marginVal;
                    const beAcos = marginVal;
                    // For net margin of 15%: (marginVal - ACOS) = 15 => ACOS = marginVal - 15 => target ROAS = 100 / (marginVal - 15)
                    const targetRoas15 = marginVal > 15 ? 100 / (marginVal - 15) : 0;
                    const targetRoas25 = marginVal > 25 ? 100 / (marginVal - 25) : 0;
                    const isClosest = Math.abs(calculated.grossMarginPercent - marginVal) < 5;

                    return (
                      <tr
                        key={marginVal}
                        className={`transition-colors ${
                          isClosest ? "bg-blue-50/80 font-semibold" : "hover:bg-slate-50/60"
                        }`}
                      >
                        <td className="py-3 px-3 font-extrabold text-slate-950 flex items-center gap-1.5">
                          <span>{marginVal}%</span>
                          {isClosest && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                              Dein Shop ({calculated.grossMarginPercent.toFixed(0)}%)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500">{cogsVal}%</td>
                        <td className="py-3 px-3 font-extrabold text-blue-600">{beRoas.toFixed(2)}x</td>
                        <td className="py-3 px-3 text-slate-700">{beAcos.toFixed(1)}%</td>
                        <td className="py-3 px-3 font-semibold text-emerald-700">
                          {targetRoas15 > 0 ? `${targetRoas15.toFixed(2)}x` : "Nicht erreichbar"}
                        </td>
                        <td className="py-3 px-3 font-semibold text-emerald-800">
                          {targetRoas25 > 0 ? `${targetRoas25.toFixed(2)}x` : "Nicht erreichbar"}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {marginVal <= 30
                            ? "Geringe Marge: Hoher Werbedruck"
                            : marginVal <= 50
                            ? "Standard E-Commerce Marge"
                            : "Starke Marge: Hoher Skalierungsspielraum"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span>
              💡 <strong>Tipp von Procware:</strong> Ein höherer ROAS ist gut, aber eine Senkung deines Wareneinsatzes von z.B. 40% auf 30% senkt deinen Break-Even ROAS dramatisch von <strong>2,50x auf 1,43x</strong>!
            </span>
            <button
              onClick={onOpenBooking}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>Jetzt Sourcing optimieren</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* SEO Guide & FAQ */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-4">
              Was ist der Unterschied zwischen ROAS und POAS?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal mb-4">
              Der <strong>ROAS (Return on Ad Spend)</strong> teilt lediglich den Umsatz durch die Werbeausgaben (<em>Umsatz / Ad Spend</em>). Er ignoriert Produktkosten, Fulfillment und Retouren komplett.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Der <strong>POAS (Profit on Ad Spend)</strong> hingegen teilt den tatsächlichen Rohgewinn durch die Werbeausgaben (<em>Bruttogewinn / Ad Spend</em>). Ein POAS über 1,0 bedeutet, dass die Kampagne nach Abzug aller Warenkosten echten Reingewinn erzeugt hat.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-6">
              Häufige Fragen zum ROAS im E-Commerce (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Was ist ein guter ROAS für Shopify Stores?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Das hängt von deiner Bruttomarge ab. Bei 60% Marge liegt der Break-Even ROAS bei ca. 1,67x – ein ROAS von 3,0x bis 4,5x ist hier sehr profitabel. Hast du nur 30% Marge, benötigst du bereits einen ROAS von über 3,33x allein zum Break-Even.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Wie hängen ROAS und ACOS zusammen?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  ACOS (Advertising Cost of Sales) ist der Kehrwert des ROAS: <em>ACOS = 1 / ROAS</em>. Ein ROAS von 4,0x entspricht einem ACOS von 25% (du gibst 25% deines Umsatzes für Werbung aus).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
