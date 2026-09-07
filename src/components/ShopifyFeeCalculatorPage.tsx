import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import {
  Calculator,
  ShoppingBag,
  Percent,
  Euro,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  TrendingDown,
  Calendar,
  Layers,
  RefreshCw,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface ShopifyFeeCalculatorPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
}

type BillingInterval = "monthly" | "yearly";
type PaymentMethodType = "shopify_payments" | "hybrid" | "external_gateway";

interface PlanTierConfig {
  id: "basic" | "shopify" | "advanced" | "plus";
  name: string;
  monthlyPrice: number;
  yearlyPricePerMonth: number;
  shopifyPaymentsFeePercent: number;
  shopifyPaymentsFeeFixed: number;
  externalTransactionFeePercent: number;
}

const PLAN_CONFIGS: Record<string, PlanTierConfig> = {
  basic: {
    id: "basic",
    name: "Basic",
    monthlyPrice: 36,
    yearlyPricePerMonth: 27,
    shopifyPaymentsFeePercent: 2.1,
    shopifyPaymentsFeeFixed: 0.30,
    externalTransactionFeePercent: 2.0,
  },
  shopify: {
    id: "shopify",
    name: "Shopify",
    monthlyPrice: 105,
    yearlyPricePerMonth: 79,
    shopifyPaymentsFeePercent: 1.8,
    shopifyPaymentsFeeFixed: 0.30,
    externalTransactionFeePercent: 1.0,
  },
  advanced: {
    id: "advanced",
    name: "Advanced",
    monthlyPrice: 384,
    yearlyPricePerMonth: 289,
    shopifyPaymentsFeePercent: 1.6,
    shopifyPaymentsFeeFixed: 0.30,
    externalTransactionFeePercent: 0.6,
  },
  plus: {
    id: "plus",
    name: "Shopify Plus",
    monthlyPrice: 2300,
    yearlyPricePerMonth: 2300,
    shopifyPaymentsFeePercent: 1.4,
    shopifyPaymentsFeeFixed: 0.20,
    externalTransactionFeePercent: 0.2,
  },
};

export const ShopifyFeeCalculatorPage: React.FC<ShopifyFeeCalculatorPageProps> = ({
  onOpenBooking,
  lang: propLang,
}) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    applyToolSeo("feeCalculator", currentLang);
    window.scrollTo(0, 0);
  }, [currentLang]);

  // State
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(25000);
  const [aov, setAov] = useState<number>(65);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "shopify" | "advanced" | "plus">("shopify");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("hybrid");
  const [shopifyPaymentsShare, setShopifyPaymentsShare] = useState<number>(75); // 75% SP, 25% PayPal
  const [externalGatewayFeePercent, setExternalGatewayFeePercent] = useState<number>(2.49); // e.g. PayPal 2.49%
  const [externalGatewayFeeFixed, setExternalGatewayFeeFixed] = useState<number>(0.35); // 0.35€
  const [appCosts, setAppCosts] = useState<number>(120);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculations
  const calculations = useMemo(() => {
    const ordersCount = aov > 0 ? Math.round(monthlyRevenue / aov) : 0;

    const spShare =
      paymentMethod === "shopify_payments"
        ? 1
        : paymentMethod === "external_gateway"
        ? 0
        : Math.max(0, Math.min(100, shopifyPaymentsShare)) / 100;
    const extShare = 1 - spShare;

    const spRevenue = monthlyRevenue * spShare;
    const extRevenue = monthlyRevenue * extShare;

    const spOrders = ordersCount * spShare;
    const extOrders = ordersCount * extShare;

    const calcForPlan = (planKey: "basic" | "shopify" | "advanced" | "plus") => {
      const cfg = PLAN_CONFIGS[planKey];
      const planBaseFee = billingInterval === "yearly" ? cfg.yearlyPricePerMonth : cfg.monthlyPrice;

      // Shopify Payments Fees (0% extra shopify surcharge)
      const spFees =
        spRevenue * (cfg.shopifyPaymentsFeePercent / 100) + spOrders * cfg.shopifyPaymentsFeeFixed;

      // External Gateway Fees (e.g. PayPal)
      const extGatewayFees =
        extRevenue * (externalGatewayFeePercent / 100) + extOrders * externalGatewayFeeFixed;

      // Shopify punitive surcharge on external gateways (2.0% on Basic, 1.0% on Shopify, 0.6% on Advanced, 0.2% on Plus)
      const shopifyTransactionSurcharge = extRevenue * (cfg.externalTransactionFeePercent / 100);

      const paymentProcessingFees = spFees + extGatewayFees;
      const totalMonthlyCost =
        planBaseFee + paymentProcessingFees + shopifyTransactionSurcharge + appCosts;
      const effectiveFeePercent = monthlyRevenue > 0 ? (totalMonthlyCost / monthlyRevenue) * 100 : 0;
      const totalYearlyCost = totalMonthlyCost * 12;

      return {
        planKey,
        name: cfg.name,
        planBaseFee,
        spFees,
        extGatewayFees,
        paymentProcessingFees,
        shopifyTransactionSurcharge,
        appCosts,
        totalMonthlyCost,
        effectiveFeePercent,
        totalYearlyCost,
      };
    };

    const current = calcForPlan(selectedPlan);
    const basic = calcForPlan("basic");
    const standard = calcForPlan("shopify");
    const advanced = calcForPlan("advanced");
    const plus = calcForPlan("plus");

    // Plan recommendation based on lowest cost
    let bestPlan = "basic";
    let lowestCost = basic.totalMonthlyCost;
    if (standard.totalMonthlyCost < lowestCost) {
      bestPlan = "shopify";
      lowestCost = standard.totalMonthlyCost;
    }
    if (advanced.totalMonthlyCost < lowestCost) {
      bestPlan = "advanced";
      lowestCost = advanced.totalMonthlyCost;
    }
    if (plus.totalMonthlyCost < lowestCost) {
      bestPlan = "plus";
      lowestCost = plus.totalMonthlyCost;
    }

    // Exact mathematical upgrade break-even points:
    // 1. Basic -> Shopify
    const diffBaseBasicToShopify =
      billingInterval === "yearly"
        ? PLAN_CONFIGS.shopify.yearlyPricePerMonth - PLAN_CONFIGS.basic.yearlyPricePerMonth
        : PLAN_CONFIGS.shopify.monthlyPrice - PLAN_CONFIGS.basic.monthlyPrice;
    const rateDiffBasicToShopify =
      spShare * ((PLAN_CONFIGS.basic.shopifyPaymentsFeePercent - PLAN_CONFIGS.shopify.shopifyPaymentsFeePercent) / 100) +
      extShare * ((PLAN_CONFIGS.basic.externalTransactionFeePercent - PLAN_CONFIGS.shopify.externalTransactionFeePercent) / 100);
    const breakEvenBasicToShopify = rateDiffBasicToShopify > 0 ? Math.round(diffBaseBasicToShopify / rateDiffBasicToShopify) : 23000;

    // 2. Shopify -> Advanced
    const diffBaseShopifyToAdvanced =
      billingInterval === "yearly"
        ? PLAN_CONFIGS.advanced.yearlyPricePerMonth - PLAN_CONFIGS.shopify.yearlyPricePerMonth
        : PLAN_CONFIGS.advanced.monthlyPrice - PLAN_CONFIGS.shopify.monthlyPrice;
    const rateDiffShopifyToAdvanced =
      spShare * ((PLAN_CONFIGS.shopify.shopifyPaymentsFeePercent - PLAN_CONFIGS.advanced.shopifyPaymentsFeePercent) / 100) +
      extShare * ((PLAN_CONFIGS.shopify.externalTransactionFeePercent - PLAN_CONFIGS.advanced.externalTransactionFeePercent) / 100);
    const breakEvenShopifyToAdvanced = rateDiffShopifyToAdvanced > 0 ? Math.round(diffBaseShopifyToAdvanced / rateDiffShopifyToAdvanced) : 110000;

    return {
      ordersCount,
      spShare,
      extShare,
      current,
      allPlans: [basic, standard, advanced, plus],
      bestPlan,
      breakEvenBasicToShopify,
      breakEvenShopifyToAdvanced,
    };
  }, [
    monthlyRevenue,
    aov,
    selectedPlan,
    billingInterval,
    paymentMethod,
    shopifyPaymentsShare,
    externalGatewayFeePercent,
    externalGatewayFeeFixed,
    appCosts,
  ]);

  const handleCopy = () => {
    const text = `Shopify Fee Calculator Analyse:
• Monatsumsatz: ${monthlyRevenue.toLocaleString("de-DE")} € (~${calculations.ordersCount} Bestellungen bei ${aov} € AOV)
• Gewählter Plan: ${PLAN_CONFIGS[selectedPlan].name} (${billingInterval === "yearly" ? "Jährliche Zahlung" : "Monatliche Zahlung"})
• Zahlungsabwicklung: ${paymentMethod === "shopify_payments" ? "Shopify Payments" : "Drittanbieter (z.B. PayPal)"}
• App-Kosten: ${appCosts} €/Monat
---
• Monats-Gesamtkosten: ${calculations.current.totalMonthlyCost.toFixed(2)} €
• Effektiver Gebührensatz: ${calculations.current.effectiveFeePercent.toFixed(2)}% vom Umsatz
• Jahreskosten: ${calculations.current.totalYearlyCost.toFixed(2)} €
• Günstigster Plan für dein Volumen: ${PLAN_CONFIGS[calculations.bestPlan].name}
Berechnet mit https://procware.io/shopify-fee-calculator`;

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
              <ToolLanguageSwitcher toolKey="feeCalculator" currentLang={currentLang} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentLang === "en" ? "Shopify Fee Calculator 2026" : "Shopify Gebühren Rechner 2026"}</span>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Shopify Fee <span className="text-blue-600">Calculator</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {currentLang === "en"
                ? "Accurately calculate all Shopify costs: monthly subscription plans, Shopify Payments processing rates, and third-party payment gateway fees. Discover the exact revenue break-even point to upgrade your plan."
                : "Berechne exakt alle Kosten deines Shopify Stores: Grundgebühr, Shopify Payments Gebühren, Zusatzgebühren bei Drittanbietern und Apps. Finde heraus, ab welchem Monatsumsatz sich ein Plan-Upgrade (z. B. auf Shopify oder Advanced) rechnet."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls / Inputs */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-950">Shop Parameter</h2>
              {/* Billing Cycle Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setBillingInterval("monthly")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    billingInterval === "monthly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Monatlich
                </button>
                <button
                  onClick={() => setBillingInterval("yearly")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    billingInterval === "yearly" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>Jährlich</span>
                  <span className="px-1 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black">
                    -25%
                  </span>
                </button>
              </div>
            </div>

            {/* 1. Monthly Revenue */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="shopify-revenue-input" className="text-sm font-bold text-slate-900">
                  Monatlicher Bruttoumsatz
                </label>
                <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                  <input
                    id="shopify-revenue-input"
                    type="number"
                    step="500"
                    min="0"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Math.max(0, Number(e.target.value)))}
                    className="w-28 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                  />
                  <span className="text-xs font-bold text-blue-600">€</span>
                </div>
              </div>
              <input
                type="range"
                min="1000"
                max="250000"
                step="1000"
                value={Math.min(250000, Math.max(1000, monthlyRevenue))}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1.000 €</span>
                <span>50.000 €</span>
                <span>250.000 €+ (Freie Eingabe oben)</span>
              </div>
            </div>

            {/* 2. Average Order Value (AOV) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="shopify-aov-input" className="text-sm font-bold text-slate-900">
                  Durchschnittlicher Bestellwert (AOV)
                </label>
                <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                  <input
                    id="shopify-aov-input"
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
                min="15"
                max="300"
                step="1"
                value={Math.min(300, Math.max(15, aov))}
                onChange={(e) => setAov(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>15 €</span>
                <span>{calculations.ordersCount} Orders / Monat</span>
                <span>300 €+</span>
              </div>
            </div>

            {/* 3. Shopify Plan Selection */}
            <div>
              <label className="text-sm font-bold text-slate-900 block mb-2">
                Aktueller Shopify Plan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["basic", "shopify", "advanced", "plus"] as const).map((planKey) => {
                  const cfg = PLAN_CONFIGS[planKey];
                  const price = billingInterval === "yearly" ? cfg.yearlyPricePerMonth : cfg.monthlyPrice;
                  const isSelected = selectedPlan === planKey;
                  return (
                    <button
                      key={planKey}
                      onClick={() => setSelectedPlan(planKey)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                          : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-xs font-extrabold">{cfg.name}</div>
                      <div className={`text-sm font-black mt-1 ${isSelected ? "text-blue-400" : "text-slate-950"}`}>
                        {price} €<span className="text-[10px] font-normal text-slate-400">/M</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Payment Gateway Selection */}
            <div>
              <label className="text-sm font-bold text-slate-900 block mb-2">
                Zahlungsabwicklung & Gateway-Mix
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod("shopify_payments")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "shopify_payments"
                      ? "bg-blue-50/80 border-blue-300 text-blue-950"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>100% SP</span>
                    <Badge variant="brand" className="text-[9px] px-1 py-0">0% Strafgebühr</Badge>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Nur Shopify Payments
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("hybrid")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "hybrid"
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>Hybrid (Mix)</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${paymentMethod === "hybrid" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                      Realistisch
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 ${paymentMethod === "hybrid" ? "text-blue-100" : "text-slate-500"}`}>
                    Shopify Payments + PayPal
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("external_gateway")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    paymentMethod === "external_gateway"
                      ? "bg-amber-50/80 border-amber-300 text-amber-950"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>100% Extern</span>
                    <span className="text-[10px] font-bold text-red-600">
                      +{PLAN_CONFIGS[selectedPlan].externalTransactionFeePercent}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Nur Drittanbieter (z.B. PayPal)
                  </div>
                </button>
              </div>

              {paymentMethod === "hybrid" && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      Shopify Payments Anteil: <strong className="text-blue-600">{shopifyPaymentsShare}%</strong>
                    </span>
                    <span className="font-bold text-slate-700">
                      PayPal / Drittanbieter: <strong className="text-amber-600">{100 - shopifyPaymentsShare}%</strong>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={shopifyPaymentsShare}
                    onChange={(e) => setShopifyPaymentsShare(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Die meisten deutschen Shopify Stores haben ~70–80% Shopify Payments (Kreditkarte, Klarna, Apple Pay) und ~20–30% PayPal.
                  </p>
                </div>
              )}

              {paymentMethod !== "shopify_payments" && (
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label htmlFor="shopify-ext-percent" className="text-[11px] text-slate-500 block mb-1">
                      PayPal / Gateway %:
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id="shopify-ext-percent"
                        type="number"
                        step="0.01"
                        value={externalGatewayFeePercent}
                        onChange={(e) => setExternalGatewayFeePercent(Math.max(0, Number(e.target.value)))}
                        className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-800"
                      />
                      <span className="font-bold text-slate-500">%</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label htmlFor="shopify-ext-fixed" className="text-[11px] text-slate-500 block mb-1">
                      Fixgebühr je Order:
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id="shopify-ext-fixed"
                        type="number"
                        step="0.01"
                        value={externalGatewayFeeFixed}
                        onChange={(e) => setExternalGatewayFeeFixed(Math.max(0, Number(e.target.value)))}
                        className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-800"
                      />
                      <span className="font-bold text-slate-500">€</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. App Monthly Subscriptions */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="shopify-apps-input" className="text-sm font-bold text-slate-900">
                  Shopify App Abos (Monatlich)
                </label>
                <div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-200">
                  <input
                    id="shopify-apps-input"
                    type="number"
                    step="5"
                    min="0"
                    value={appCosts}
                    onChange={(e) => setAppCosts(Math.max(0, Number(e.target.value)))}
                    className="w-20 bg-transparent text-right text-sm font-extrabold text-blue-700 outline-none"
                  />
                  <span className="text-xs font-bold text-blue-600">€</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="10"
                value={Math.min(800, Math.max(0, appCosts))}
                onChange={(e) => setAppCosts(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>0 € (Keine Paid Apps)</span>
                <span>150 € (Standard Setup)</span>
                <span>800 €+ (Freie Eingabe)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cost Breakdown & Comparison */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary KPI Card */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <div className="flex items-start justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Monatliche Shopify Gesamtkosten
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white mt-1">
                    {calculations.current.totalMonthlyCost.toFixed(2)} €
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    entspricht {calculations.current.totalYearlyCost.toFixed(0)} € pro Jahr
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Effektiver Satz
                  </span>
                  <div className="text-3xl font-black text-blue-400 mt-1">
                    {calculations.current.effectiveFeePercent.toFixed(2)}%
                  </div>
                  <div className="text-[11px] text-slate-400">vom Bruttoumsatz</div>
                </div>
              </div>

              {/* Cost Item Breakdown */}
              <div className="pt-6 space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-300">Shopify Grundgebühr ({PLAN_CONFIGS[selectedPlan].name}):</span>
                  <span className="font-bold text-white">
                    {calculations.current.planBaseFee.toFixed(2)} €
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-300">Zahlungsabwicklung (Karten / Payment):</span>
                  <span className="font-bold text-white">
                    {calculations.current.paymentProcessingFees.toFixed(2)} €
                  </span>
                </div>

                {calculations.current.shopifyTransactionSurcharge > 0 && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-red-400">Shopify Drittanbieter-Zusatzgebühr:</span>
                    <span className="font-bold text-red-400">
                      +{calculations.current.shopifyTransactionSurcharge.toFixed(2)} €
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-300">Shopify Apps & Plugins:</span>
                  <span className="font-bold text-white">
                    {calculations.current.appCosts.toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Recommendation Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-blue-950/60 border border-blue-800/80 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-white">
                    {currentLang === "en"
                      ? `Plan Recommendation for ${monthlyRevenue.toLocaleString("en-US")} € Monthly Volume:`
                      : `Plan-Empfehlung für ${monthlyRevenue.toLocaleString("de-DE")} € Monatsumsatz:`}
                  </div>
                  <div className="text-slate-300 mt-1 leading-relaxed">
                    {calculations.bestPlan === selectedPlan ? (
                      <span>
                        {currentLang === "en"
                          ? `You are already on the most cost-effective tier for your volume (${PLAN_CONFIGS[selectedPlan].name}).`
                          : `Du nutzt bereits den für dein Volumen günstigsten Plan (${PLAN_CONFIGS[selectedPlan].name}).`}
                      </span>
                    ) : (
                      <span>
                        {currentLang === "en" ? "Switching to " : "Durch einen Wechsel zu "}
                        <strong>{PLAN_CONFIGS[calculations.bestPlan].name}</strong>{" "}
                        {currentLang === "en" ? "saves you approx. " : "sparst du ca. "}
                        <strong className="text-emerald-400">
                          {(
                            calculations.current.totalMonthlyCost -
                            calculations.allPlans.find((p) => p.planKey === calculations.bestPlan)!
                              .totalMonthlyCost
                          ).toFixed(2)}{" "}
                          € {currentLang === "en" ? "per month" : "monatlich"}
                        </strong>{" "}
                        {currentLang === "en" ? "thanks to lower transaction fees!" : "durch günstigere Zahlungsgebühren!"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Procware Sourcing Advantage Callout */}
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-800/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-xs font-bold text-blue-300">
                    {currentLang === "en" ? "Procware Margin Growth:" : "Marge steigern mit Procware:"}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentLang === "en"
                    ? "While Shopify fees and app subscriptions take 2% to 5% of your revenue, factory-direct sourcing through Procware slashes your product costs by 20% to 40%. You instantly absorb all store fees and keep far higher net profits on every order."
                    : "Während Shopify-Gebühren und Software-Abos deine Marge um 2% bis 5% belasten, spart dir direkter Fabrikeinkauf mit Procware 20% bis 40% deiner Wareneinsatzkosten. So neutralisierst du Gebühren mühelos und behältst deutlich mehr Reingewinn pro Verkauf."}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (currentLang === "en" ? "Copied!" : "Kopiert!") : (currentLang === "en" ? "Copy Fee Summary" : "Kostenübersicht kopieren")}</span>
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

            {/* Plan Comparison Matrix */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-950 mb-3">
                Direkter Kostenvergleich aller Pläne bei {monthlyRevenue.toLocaleString("de-DE")} € Umsatz
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {calculations.allPlans.slice(0, 3).map((p) => {
                  const isBest = p.planKey === calculations.bestPlan;
                  const isCurrent = p.planKey === selectedPlan;
                  return (
                    <div
                      key={p.planKey}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isBest
                          ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                          : isCurrent
                          ? "bg-slate-50 border-slate-300 text-slate-900"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      <div className="text-xs font-bold">{p.name}</div>
                      <div className="text-lg font-black text-slate-950 mt-1">
                        {p.totalMonthlyCost.toFixed(0)} €
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {p.effectiveFeePercent.toFixed(1)}% Gebühr
                      </div>
                      {isBest && (
                        <span className="inline-block mt-2 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">
                          Bester Wert
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Break-Even Thresholds Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Wann lohnt sich welches Plan-Upgrade? (Exakter Break-Even)
                </h3>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Basic → Shopify Plan</span>
                    <span className="text-slate-500 text-[11px]">spart 0,30% SP-Gebühr + 1,0% PayPal-Strafgebühr</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">
                      ab ~{calculations.breakEvenBasicToShopify.toLocaleString("de-DE")} €/Mo
                    </span>
                    <span className={`text-[10px] font-bold ${monthlyRevenue >= calculations.breakEvenBasicToShopify ? "text-emerald-600" : "text-slate-400"}`}>
                      {monthlyRevenue >= calculations.breakEvenBasicToShopify ? "✓ Upgrade empfohlen!" : "Noch nicht erreicht"}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Shopify → Advanced Plan</span>
                    <span className="text-slate-500 text-[11px]">spart weitere 0,20% SP + 0,40% PayPal-Strafgebühr</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">
                      ab ~{calculations.breakEvenShopifyToAdvanced.toLocaleString("de-DE")} €/Mo
                    </span>
                    <span className={`text-[10px] font-bold ${monthlyRevenue >= calculations.breakEvenShopifyToAdvanced ? "text-emerald-600" : "text-slate-400"}`}>
                      {monthlyRevenue >= calculations.breakEvenShopifyToAdvanced ? "✓ Upgrade empfohlen!" : "Noch nicht erreicht"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content & FAQ */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-4">
              Wann rechnet sich ein Upgrade vom Basic auf den Shopify Plan?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal mb-4">
              Der Break-Even-Punkt zwischen dem <strong>Basic Plan (36 €/Monat)</strong> und dem regulären{" "}
              <strong>Shopify Plan (105 €/Monat)</strong> liegt bei ca. <strong>18.000 € bis 23.000 € Monatsumsatz</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Im regulären Shopify Plan zahlst du mit Shopify Payments nur <strong>1,8% + 0,30 €</strong> statt{" "}
              <strong>2,1% + 0,30 €</strong>. Diese 0,3 Prozentpunkte Einsparung machen bei 23.000 € Monatsumsatz
              bereits 69 € aus – was die 69 € Differenz bei der Grundgebühr exakt ausgleicht. Ab jedem Euro darüber sparst
              du bares Geld, hast erweiterte Berichte und zusätzliche Mitarbeiter-Accounts.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-6">
              Häufige Fragen zu Shopify Gebühren (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Was kostet Shopify wirklich pro Monat?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Zu der monatlichen Grundgebühr (ab 27 € bei jährlicher Zahlung) kommen die Transaktionsgebühren für
                  Kartenzahlungen (ca. 1,6% - 2,1% + 0,30 € je Order) sowie monatliche Kosten für Apps (z.B. Reviews,
                  E-Mail Marketing, Buchhaltung). Rechnerisch liegen die Gesamtkosten eines Stores meist zwischen{" "}
                  <strong>2,4% und 4,5% des Bruttoumsatzes</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Fallen bei Shopify Payments zusätzliche Transaktionsgebühren an?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Nein. Wenn du <strong>Shopify Payments</strong> aktiviert hast, entfällt die Shopify-eigene
                  Zusatztransaktionsgebühr (0%). Nutzt du hingegen externe Gateways ohne Shopify Payments, verlangt
                  Shopify eine zusätzliche Strafgebühr von 2,0% (Basic), 1,0% (Shopify) bzw. 0,6% (Advanced).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Gibt es versteckte Kosten bei Shopify?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Häufig übersehen werden Währungsumrechnungsgebühren (1,5% bis 2% bei Verkäufen in Fremdwährungen),
                  internationale Kreditkartenzuschläge (ca. 1% Aufschlag für Karten außerhalb der EU) und Chargeback-Gebühren
                  im Falle von Rückbuchungen (15 € je Streitfall).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
