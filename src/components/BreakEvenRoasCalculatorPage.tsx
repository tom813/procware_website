import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import {
  Scale,
  Calculator,
  Percent,
  Euro,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  TrendingDown,
  Calendar,
  Layers,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface BreakEvenRoasCalculatorPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
  hideSeoContent?: boolean;
}

export const BreakEvenRoasCalculatorPage: React.FC<BreakEvenRoasCalculatorPageProps> = ({
  onOpenBooking,
  lang: propLang,
  hideSeoContent = false,
}) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    applyToolSeo("breakEvenRoas", currentLang);
    window.scrollTo(0, 0);
  }, [currentLang]);

  // Inputs
  const [retailPriceGross, setRetailPriceGross] = useState<number>(49.99);
  const [vatPercent, setVatPercent] = useState<number>(19); // 19% MwSt
  const [cogs, setCogs] = useState<number>(11.50); // Landed Cost
  const [fulfillmentCost, setFulfillmentCost] = useState<number>(4.90); // Pick, pack, shipping
  const [paymentFeePercent, setPaymentFeePercent] = useState<number>(2.1); // Shopify Payments
  const [paymentFeeFixed, setPaymentFeeFixed] = useState<number>(0.30);
  const [packagingCost, setPackagingCost] = useState<number>(0.90);
  const [returnRatePercent, setReturnRatePercent] = useState<number>(8); // 8% return rate
  const [returnCostPerCase, setReturnCostPerCase] = useState<number>(4.50); // Inspection, return label
  const [targetRoas, setTargetRoas] = useState<number>(2.8); // Slider to simulate net profit
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const calculated = useMemo(() => {
    const netRevenue = retailPriceGross / (1 + vatPercent / 100);
    const paymentFee = retailPriceGross * (paymentFeePercent / 100) + paymentFeeFixed;
    const returnCostBlended = (returnRatePercent / 100) * returnCostPerCase;

    // Direct variable costs per order (excluding ad spend)
    const totalVariableCost = cogs + fulfillmentCost + paymentFee + packagingCost + returnCostBlended;

    // Contribution margin before ad spend (Deckungsbeitrag vor Werbung)
    const contributionMarginBeforeAds = netRevenue - totalVariableCost;
    const contributionMarginPercent = netRevenue > 0 ? (contributionMarginBeforeAds / netRevenue) * 100 : 0;

    // Break Even CPA (Maximal erlaubte Werbekosten je Bestellung)
    const breakEvenCpa = Math.max(0, contributionMarginBeforeAds);

    // Break Even ROAS: Net Revenue / Break Even CPA (or based on gross revenue as tracked in Meta/Shopify)
    // Most merchants compare Meta Gross Tracked Revenue to Ad Spend:
    const breakEvenRoasGross = breakEvenCpa > 0 ? retailPriceGross / breakEvenCpa : 99;
    const breakEvenRoasNet = breakEvenCpa > 0 ? netRevenue / breakEvenCpa : 99;

    // Target ROAS Simulation
    const simulatedCpa = targetRoas > 0 ? retailPriceGross / targetRoas : 0;
    const simulatedNetProfitPerOrder = contributionMarginBeforeAds - simulatedCpa;
    const simulatedProfitMargin = retailPriceGross > 0 ? (simulatedNetProfitPerOrder / retailPriceGross) * 100 : 0;

    // Procware Impact: If COGS is reduced by 20%
    const optimizedCogs = cogs * 0.8;
    const optimizedVariableCost = optimizedCogs + fulfillmentCost + paymentFee + packagingCost + returnCostBlended;
    const optimizedMargin = netRevenue - optimizedVariableCost;
    const optimizedBreakEvenRoas = optimizedMargin > 0 ? retailPriceGross / optimizedMargin : 0;

    return {
      netRevenue,
      paymentFee,
      returnCostBlended,
      totalVariableCost,
      contributionMarginBeforeAds,
      contributionMarginPercent,
      breakEvenCpa,
      breakEvenRoasGross,
      breakEvenRoasNet,
      simulatedCpa,
      simulatedNetProfitPerOrder,
      simulatedProfitMargin,
      optimizedCogs,
      optimizedBreakEvenRoas,
    };
  }, [
    retailPriceGross,
    vatPercent,
    cogs,
    fulfillmentCost,
    paymentFeePercent,
    paymentFeeFixed,
    packagingCost,
    returnRatePercent,
    returnCostPerCase,
    targetRoas,
  ]);

  const handleCopy = () => {
    const text = `Procware Break-Even ROAS Analyse:
• Verkaufspreis (brutto): ${retailPriceGross.toFixed(2)} € (Netto: ${calculated.netRevenue.toFixed(2)} €)
• Einkaufspreis (Landed Cost): ${cogs.toFixed(2)} €
• Fulfillment & Versand: ${fulfillmentCost.toFixed(2)} €
• Deckungsbeitrag vor Ads: ${calculated.contributionMarginBeforeAds.toFixed(2)} € (${calculated.contributionMarginPercent.toFixed(1)}%)
---
• Break-Even ROAS: ${calculated.breakEvenRoasGross.toFixed(2)}x
• Break-Even CPA (Max. Ad Spend je Order): ${calculated.breakEvenCpa.toFixed(2)} €
• Bei Ziel-ROAS ${targetRoas}x beträgt der Reingewinn: +${calculated.simulatedNetProfitPerOrder.toFixed(2)} € je Bestellung
Berechnet mit https://procware.io/break-even-roas-calculator`;

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
              <ToolLanguageSwitcher toolKey="breakEvenRoas" currentLang={currentLang} />
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Scale className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentLang === "en" ? "Shopify Profitability & Target ROAS" : "Shopify Rentabilitäts-Rechner"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Break Even ROAS <span className="text-blue-600">Calculator</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {currentLang === "en"
                ? "Calculate the minimum ROAS your ad campaigns need to break even after subtracting COGS, shipping, payment fees, and returns."
                : "Finde heraus, welchen Mindest-ROAS deine Meta-, TikTok- und Google-Kampagnen erzielen müssen, damit du nach Abzug von COGS, Fulfillment, Zahlungsgebühren und Retouren keinen Cent draufzahlst."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-xl font-black text-slate-950 pb-4 border-b border-slate-100 flex items-center justify-between">
              <span>Produkt- & Kostenstruktur</span>
              <button
                onClick={() => {
                  setRetailPriceGross(49.99);
                  setCogs(11.50);
                  setFulfillmentCost(4.90);
                  setReturnRatePercent(8);
                  setTargetRoas(2.8);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Standardwerte</span>
              </button>
            </h2>

            {/* Retail Price & VAT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Verkaufspreis brutto (UVP)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={retailPriceGross}
                    onChange={(e) => setRetailPriceGross(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Mehrwertsteuer (MwSt)
                </label>
                <select
                  value={vatPercent}
                  onChange={(e) => setVatPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value={19}>19% (Deutschland)</option>
                  <option value={20}>20% (Österreich)</option>
                  <option value={7}>7% (Ermäßigt DE)</option>
                  <option value={0}>0% (Netto / B2B)</option>
                </select>
              </div>
            </div>

            {/* COGS (Landed Cost) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="be-cogs-input" className="text-xs font-bold text-slate-900">
                  Einkaufspreis / COGS (Landed Cost: Einkauf + Fracht + Zoll)
                </label>
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  <input
                    id="be-cogs-input"
                    type="number"
                    step="0.10"
                    min="0"
                    value={cogs}
                    onChange={(e) => setCogs(Math.max(0, Number(e.target.value)))}
                    className="w-16 bg-transparent text-right text-xs font-extrabold text-blue-700 outline-none"
                  />
                  <span className="text-xs font-bold text-blue-600">€</span>
                </div>
              </div>
              <input
                type="range"
                min="2"
                max="100"
                step="0.5"
                value={Math.min(100, Math.max(2, cogs))}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Fulfillment & Shipping */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="be-fulfillment-input" className="text-xs font-bold text-slate-900">
                  Fulfillment & Versand (Pick, Pack & Porto)
                </label>
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  <input
                    id="be-fulfillment-input"
                    type="number"
                    step="0.05"
                    min="0"
                    value={fulfillmentCost}
                    onChange={(e) => setFulfillmentCost(Math.max(0, Number(e.target.value)))}
                    className="w-16 bg-transparent text-right text-xs font-extrabold text-blue-700 outline-none"
                  />
                  <span className="text-xs font-bold text-blue-600">€</span>
                </div>
              </div>
              <input
                type="range"
                min="1.5"
                max="15"
                step="0.1"
                value={Math.min(15, Math.max(1.5, fulfillmentCost))}
                onChange={(e) => setFulfillmentCost(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Returns & Packaging */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Retourenquote (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.1"
                    value={returnRatePercent}
                    onChange={(e) => setReturnRatePercent(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Verpackung & Extras
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.05"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>
            </div>

            {/* Interactive Simulator: Target ROAS */}
            <div className="pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="be-targetroas-input" className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gewinn-Simulator bei Ziel-ROAS</span>
                </label>
                <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                  <input
                    id="be-targetroas-input"
                    type="number"
                    step="0.05"
                    min="0.5"
                    value={targetRoas}
                    onChange={(e) => setTargetRoas(Math.max(0.5, Number(e.target.value)))}
                    className="w-14 bg-transparent text-right text-xs font-extrabold text-slate-950 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-600">x</span>
                </div>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.1"
                value={Math.min(6, Math.max(1, targetRoas))}
                onChange={(e) => setTargetRoas(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                <span>CPA: {calculated.simulatedCpa.toFixed(2)} €</span>
                <span className={calculated.simulatedNetProfitPerOrder >= 0 ? "font-bold text-emerald-600" : "font-bold text-red-600"}>
                  Reingewinn: {calculated.simulatedNetProfitPerOrder >= 0 ? "+" : ""}
                  {calculated.simulatedNetProfitPerOrder.toFixed(2)} € / Order
                </span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Break-Even ROAS (Mindestwert)
                  </span>
                  <div className="text-5xl font-black text-white mt-1">
                    {calculated.breakEvenRoasGross.toFixed(2)}x
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Bei diesem ROAS machst du genau 0,00 € Gewinn und Verlust.
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Max. CPA (CAC)
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    {calculated.breakEvenCpa.toFixed(2)} €
                  </div>
                  <div className="text-[11px] text-slate-400">je Bestellung</div>
                </div>
              </div>

              {/* Unit Economics Breakdown */}
              <div className="pt-6 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Netto-Verkaufserlös (ohne {vatPercent}% MwSt):</span>
                  <span className="font-bold text-white">{calculated.netRevenue.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>- COGS (Wareneinkauf, Fracht, Zoll):</span>
                  <span>-{cogs.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>- Fulfillment & Versand:</span>
                  <span>-{fulfillmentCost.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>- Zahlungsgebühren (Shopify Payments):</span>
                  <span>-{calculated.paymentFee.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>- Retouren & Verpackung:</span>
                  <span>-{(calculated.returnCostBlended + packagingCost).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-emerald-400">
                  <span>Verfügbar für Werbekosten (Deckungsbeitrag vor Ads):</span>
                  <span>{calculated.contributionMarginBeforeAds.toFixed(2)} €</span>
                </div>
              </div>

              {/* Procware Sourcing Advantage Box */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-800/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-bold text-blue-300">
                    {currentLang === "en" ? "Procware Margin Advantage:" : "Marge steigern mit Procware:"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentLang === "en"
                    ? `By sourcing factory-direct via Procware, you eliminate wholesale markups and cut product costs by 20% to 40% (${cogs.toFixed(2)} € → ${calculated.optimizedCogs.toFixed(2)} €). Your Break-Even ROAS plummets from ${calculated.breakEvenRoasGross.toFixed(2)}x to ${calculated.optimizedBreakEvenRoas.toFixed(2)}x — giving you unmatched margin cushion to scale ad spend profitably.`
                    : `Durch Direkteinkauf ab Fabrik ohne Zwischenhändler senkt Procware deine Produktkosten um 20% bis 40% (${cogs.toFixed(2)} € → ${calculated.optimizedCogs.toFixed(2)} €). Dein Break-Even ROAS sinkt sofort von ${calculated.breakEvenRoasGross.toFixed(2)}x auf ${calculated.optimizedBreakEvenRoas.toFixed(2)}x – deine Marge steigt und du kannst bei Ad-Auktionen aggressiver bieten als jeder Konkurrent.`}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (currentLang === "en" ? "Copied!" : "Kopiert!") : (currentLang === "en" ? "Copy Results" : "Ergebnis kopieren")}</span>
                  </button>
                  <a
                    href="https://calendly.com/team-procware/new-meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{currentLang === "en" ? "Boost Margin with Procware" : "Marge steigern mit Procware"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & FAQ */}
      {!hideSeoContent && (
        <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-4">
              Wie berechnet man den Break-Even ROAS im E-Commerce?
            </h2>
            <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4">
              Break Even ROAS = Verkaufspreis / (Nettoerlös - COGS - Versand - Payment - Retouren)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Der häufigste Fehler im Performance Marketing ist es, den Break-Even ROAS nur anhand des reinen Einkaufspreises
              zu kalkulieren. Wer Fracht, Zölle, Payment Fees, Verpackung und die Retourenquote ignoriert, zahlt bei scheinbar
              profitablem ROAS in Wirklichkeit drauf.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-6">
              Häufige Fragen zum Break Even ROAS (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Welcher ROAS wird im Meta / Google Werbekonto angezeigt: Brutto oder Netto?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  In den allermeisten Shopify Setups trackt das Pixel den <strong>Bruttobetrag</strong> (inkl. MwSt und Versandkosten), da dies der an Shopify übertragene Checkout-Wert ist. Unser Rechner setzt den Break-Even ROAS daher exakt ins Verhältnis zum Brutto-Kaufpreis.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Wie senke ich meinen Break-Even ROAS am effektivsten?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Über zwei Hebel: 1. Den Verkaufspreis/AOV durch Bundles erhöhen und 2. Den Wareneinsatz (COGS) sowie Logistikkosten senken. Mit <strong>Procware</strong> sparst du durch direkte Fabrikbeschaffung und gebündelte Fracht typischerweise 20–35% der variablen Stückkosten.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
