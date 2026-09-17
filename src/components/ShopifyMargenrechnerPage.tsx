import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import {
  Calculator,
  Percent,
  Euro,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  TrendingUp,
  Package,
  Calendar,
  Layers,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface ShopifyMargenrechnerPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
  hideSeoContent?: boolean;
}

export const ShopifyMargenrechnerPage: React.FC<ShopifyMargenrechnerPageProps> = ({
  onOpenBooking,
  lang: propLang,
  hideSeoContent = false,
}) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    applyToolSeo("marginCalculator", currentLang);
    window.scrollTo(0, 0);
  }, [currentLang]);

  // Inputs
  const [retailPriceGross, setRetailPriceGross] = useState<number>(69.90);
  const [vatPercent, setVatPercent] = useState<number>(19);
  const [sourcingPrice, setSourcingPrice] = useState<number>(12.50); // FOB Fabrikpreis
  const [shippingAndCustoms, setShippingAndCustoms] = useState<number>(3.20); // Fracht + Zoll je Stück
  const [packagingCost, setPackagingCost] = useState<number>(1.50); // Custom Box, Flyer
  const [fulfillmentPorto, setFulfillmentPorto] = useState<number>(4.80); // Pick, Pack, Versand
  const [paymentPercent, setPaymentPercent] = useState<number>(2.1); // Shopify Payments
  const [paymentFixed, setPaymentFixed] = useState<number>(0.30);
  const [marketingCpa, setMarketingCpa] = useState<number>(19.50); // Werbekosten je Verkauf
  const [returnRate, setReturnRate] = useState<number>(6); // %
  const [returnCost, setReturnCost] = useState<number>(4.00); // Handling je Retoure
  const [monthlyGoalProfit, setMonthlyGoalProfit] = useState<number>(10000); // 10.000 € Wunschgewinn
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const calculated = useMemo(() => {
    const netRevenue = retailPriceGross / (1 + vatPercent / 100);
    const vatAmount = retailPriceGross - netRevenue;

    // Landed Cost (COGS)
    const landedCost = sourcingPrice + shippingAndCustoms;

    // Payment fee
    const paymentFee = retailPriceGross * (paymentPercent / 100) + paymentFixed;

    // Blended return cost
    const returnLoss = (returnRate / 100) * returnCost;

    // DB 1: Net Revenue - Landed Cost
    const db1Euro = netRevenue - landedCost;
    const db1Percent = netRevenue > 0 ? (db1Euro / netRevenue) * 100 : 0;

    // DB 2: DB 1 - Packaging - Fulfillment - Payment
    const directHandlingCost = packagingCost + fulfillmentPorto + paymentFee;
    const db2Euro = db1Euro - directHandlingCost;
    const db2Percent = netRevenue > 0 ? (db2Euro / netRevenue) * 100 : 0;

    // DB 3 (Reingewinn vor Steuern / EBT): DB 2 - Marketing CPA - Retourenverlust
    const db3Euro = db2Euro - marketingCpa - returnLoss;
    const db3Percent = netRevenue > 0 ? (db3Euro / netRevenue) * 100 : 0;

    // Markup Factor (Verkaufspreis netto / Einkaufspreis)
    const markupFactor = sourcingPrice > 0 ? netRevenue / sourcingPrice : 0;

    // Monthly orders needed for goal
    const ordersNeeded = db3Euro > 0 ? Math.ceil(monthlyGoalProfit / db3Euro) : 0;
    const requiredRevenue = ordersNeeded * retailPriceGross;

    // Percent breakdown of gross retail price
    const pctVat = (vatAmount / retailPriceGross) * 100;
    const pctCogs = (landedCost / retailPriceGross) * 100;
    const pctLogistics = (directHandlingCost / retailPriceGross) * 100;
    const pctMarketing = ((marketingCpa + returnLoss) / retailPriceGross) * 100;
    const pctProfit = (Math.max(0, db3Euro) / retailPriceGross) * 100;

    return {
      netRevenue,
      vatAmount,
      landedCost,
      paymentFee,
      returnLoss,
      db1Euro,
      db1Percent,
      directHandlingCost,
      db2Euro,
      db2Percent,
      db3Euro,
      db3Percent,
      markupFactor,
      ordersNeeded,
      requiredRevenue,
      pctVat,
      pctCogs,
      pctLogistics,
      pctMarketing,
      pctProfit,
    };
  }, [
    retailPriceGross,
    vatPercent,
    sourcingPrice,
    shippingAndCustoms,
    packagingCost,
    fulfillmentPorto,
    paymentPercent,
    paymentFixed,
    marketingCpa,
    returnRate,
    returnCost,
    monthlyGoalProfit,
  ]);

  const handleCopy = () => {
    const text = `Procware Shopify Margen-Analyse:
• Verkaufspreis: ${retailPriceGross.toFixed(2)} € (Netto: ${calculated.netRevenue.toFixed(2)} €)
• Landed Cost (Einkauf + Fracht + Zoll): ${calculated.landedCost.toFixed(2)} €
• Logistik & Payment: ${calculated.directHandlingCost.toFixed(2)} €
• Marketing CPA & Retouren: ${(marketingCpa + calculated.returnLoss).toFixed(2)} €
---
• DB 1 (Rohertrag): ${calculated.db1Euro.toFixed(2)} € (${calculated.db1Percent.toFixed(1)}%)
• DB 2 (Nach Logistik/Payment): ${calculated.db2Euro.toFixed(2)} € (${calculated.db2Percent.toFixed(1)}%)
• DB 3 (Reingewinn je Stück): ${calculated.db3Euro.toFixed(2)} € (${calculated.db3Percent.toFixed(1)}%)
• Aufschlagsfaktor: ${calculated.markupFactor.toFixed(1)}x
• Nötige Verkäufe für ${monthlyGoalProfit.toLocaleString("de-DE")} € Gewinn: ${calculated.ordersNeeded} Orders / Monat
Berechnet mit https://procware.io/shopify-margenrechner`;

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
              <ToolLanguageSwitcher toolKey="marginCalculator" currentLang={currentLang} />
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentLang === "en" ? "E-Commerce Contribution Margin Calculator" : "E-Commerce Deckungsbeitrag Rechner"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Shopify <span className="text-blue-600">{currentLang === "en" ? "Margin Calculator" : "Margenrechner"}</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {currentLang === "en"
                ? "Calculate true product margins for your Shopify store: breakdown by CM 1 (gross profit), CM 2 (after shipping & payment fees), and CM 3 (net profit after ad spend & returns)."
                : "Berechne die echte Marge deiner Shopify-Produkte: Aufschlüsselung nach DB 1 (Rohertrag), DB 2 (nach Logistik & Payment) und DB 3 (Reingewinn nach Ads & Retouren)."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="text-xl font-black text-slate-950 pb-4 border-b border-slate-100 flex items-center justify-between">
              <span>Produktkalkulation</span>
              <button
                onClick={() => {
                  setRetailPriceGross(69.90);
                  setSourcingPrice(12.50);
                  setShippingAndCustoms(3.20);
                  setFulfillmentPorto(4.80);
                  setMarketingCpa(19.50);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </h2>

            {/* Price & VAT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Verkaufspreis (brutto inkl. MwSt)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={retailPriceGross}
                    onChange={(e) => setRetailPriceGross(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Mehrwertsteuer
                </label>
                <select
                  value={vatPercent}
                  onChange={(e) => setVatPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
                >
                  <option value={19}>19% (DE)</option>
                  <option value={20}>20% (AT)</option>
                  <option value={7}>7% (Ermäßigt)</option>
                  <option value={0}>0% (B2B)</option>
                </select>
              </div>
            </div>

            {/* Sourcing & Landed Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Einkaufspreis Fabrik (FOB)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={sourcingPrice}
                    onChange={(e) => setSourcingPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Fracht & Einfuhrzoll je Stück
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={shippingAndCustoms}
                    onChange={(e) => setShippingAndCustoms(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>
            </div>

            {/* Logistics & Packaging */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Verpackung & Beileger
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={packagingCost}
                    onChange={(e) => setPackagingCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Fulfillment & DHL Porto
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={fulfillmentPorto}
                    onChange={(e) => setFulfillmentPorto(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>
            </div>

            {/* Marketing & Returns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Marketing CPA (Ad Spend / Order)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={marketingCpa}
                    onChange={(e) => setMarketingCpa(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Retourenquote (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>

            {/* Monthly Profit Target */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-900">
                  Monatliches Gewinnziel
                </label>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                  {monthlyGoalProfit.toLocaleString("de-DE")} €
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={monthlyGoalProfit}
                onChange={(e) => setMonthlyGoalProfit(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Reingewinn (DB 3 je Stück)
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 mt-1">
                    +{calculated.db3Euro.toFixed(2)} €
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    entspricht {calculated.db3Percent.toFixed(1)}% Nettomarge
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Aufschlagsfaktor
                  </span>
                  <div className="text-3xl font-black text-white mt-1">
                    {calculated.markupFactor.toFixed(1)}x
                  </div>
                  <div className="text-[11px] text-slate-400">Nettoerlös / Einkauf</div>
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="pt-6">
                <div className="text-xs font-bold text-slate-300 mb-2">
                  Wohin fließt jeder Euro des Kunden?
                </div>
                <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-800 p-0.5 gap-0.5">
                  <div
                    style={{ width: `${calculated.pctVat}%` }}
                    className="h-full bg-slate-500 rounded-xs"
                    title={`MwSt: ${calculated.pctVat.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${calculated.pctCogs}%` }}
                    className="h-full bg-amber-500 rounded-xs"
                    title={`Wareneinkauf: ${calculated.pctCogs.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${calculated.pctLogistics}%` }}
                    className="h-full bg-blue-500 rounded-xs"
                    title={`Logistik & Payment: ${calculated.pctLogistics.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${calculated.pctMarketing}%` }}
                    className="h-full bg-purple-500 rounded-xs"
                    title={`Marketing & Retouren: ${calculated.pctMarketing.toFixed(1)}%`}
                  />
                  <div
                    style={{ width: `${calculated.pctProfit}%` }}
                    className="h-full bg-emerald-500 rounded-xs"
                    title={`Reingewinn: ${calculated.pctProfit.toFixed(1)}%`}
                  />
                </div>

                {/* Legend */}
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>MwSt ({calculated.pctVat.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Ware ({calculated.pctCogs.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Logistik ({calculated.pctLogistics.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Ads ({calculated.pctMarketing.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-400">Profit ({calculated.pctProfit.toFixed(0)}%)</span>
                  </div>
                </div>
              </div>

              {/* 3 Margin Stages */}
              <div className="mt-6 space-y-2 pt-6 border-t border-slate-800 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300">Deckungsbeitrag I (Rohertrag nach Wareneinkauf):</span>
                  <span className="font-bold text-white">
                    {calculated.db1Euro.toFixed(2)} € ({calculated.db1Percent.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300">Deckungsbeitrag II (nach Logistik & Payment):</span>
                  <span className="font-bold text-white">
                    {calculated.db2Euro.toFixed(2)} € ({calculated.db2Percent.toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900 border border-emerald-900/60">
                  <span className="text-emerald-300 font-bold">Deckungsbeitrag III (Reingewinn nach Ads):</span>
                  <span className="font-black text-emerald-400">
                    +{calculated.db3Euro.toFixed(2)} € ({calculated.db3Percent.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Procware Margin Increase Banner */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-800/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-bold text-blue-300">
                    {currentLang === "en" ? "Procware Margin Growth:" : "Marge steigern mit Procware:"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {currentLang === "en"
                    ? "Sourcing with Procware increases your margins by 20% to 45%"
                    : "Wer bei Procware sourct, erhöht seine Marge im Schnitt um 20% bis 45%"}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentLang === "en"
                    ? "Through direct access to verified factories and genuine wholesale production prices without middlemen, you retain significantly higher contribution margins (CM 1 & CM 2) on every single sale."
                    : "Durch direkten Zugriff auf geprüfte Hersteller und echte Fabrikpreise ohne Zwischenhändler bleibt bei jedem Verkauf spürbar mehr Deckungsbeitrag (DB 1 & DB 2) für deinen Shop übrig."}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (currentLang === "en" ? "Copied!" : "Kopiert!") : (currentLang === "en" ? "Copy Breakdown" : "Kalkulation kopieren")}</span>
                  </button>
                  <a
                    href="https://calendly.com/team-procware/new-meeting"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{currentLang === "en" ? "Boost Margins with Procware" : "Marge mit Procware hebeln"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO & Guide */}
      {!hideSeoContent && (
        <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-4">
              Die 3 Deckungsbeitragsstufen im E-Commerce erklärt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-950 text-sm mb-1">Deckungsbeitrag I (DB 1)</div>
                <p>
                  Nettoverkaufserlös abzüglich reiner Produkt-Landed-Costs (Einkaufspreis FOB + Fracht + Zoll).
                  Zeigt die reine Produktrentabilität.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-950 text-sm mb-1">Deckungsbeitrag II (DB 2)</div>
                <p>
                  DB 1 abzüglich der operativen Fulfillmentkosten, Kartonage und Payment-Gateways (Shopify Payments / PayPal).
                  Dieser Betrag steht maximal für Werbung und Fixkosten zur Verfügung.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-950 text-sm mb-1">Deckungsbeitrag III (DB 3)</div>
                <p>
                  DB 2 abzüglich der Werbekosten (CPA je Order) und anteiliger Retourenkosten. Dies ist der tatsächliche
                  Stückgewinn, der in dein Unternehmen fließt.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-6">
              Häufige Fragen zur Margenberechnung auf Shopify (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Was ist eine gesunde Bruttomarge für Shopify Stores?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Im DTC E-Commerce sollte der <strong>DB 1 mindestens 60% bis 75%</strong> betragen (Faktor 3x bis 5x
                  auf den Einkaufspreis), um die steigenden Werbekosten auf Meta & TikTok sowie Logistik abzufedern.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Wie hilft Procware bei der Margenoptimierung?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Procware verbindet deinen Shopify Store direkt mit geprüften Herstellern und optimiert die gesamte
                  Lieferkette (Sourcing, Qualitätsprüfung, Luft- & Seefracht, 100% deutsches Fulfillment & Retourenservice). Dadurch sparst
                  du Zwischenhändler-Aufschläge und steigerst deinen DB 1 um 15–30%.
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
