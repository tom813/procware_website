import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import {
  Wallet,
  Calculator,
  Percent,
  Euro,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Calendar,
  Layers,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Sliders,
  BarChart3,
  LineChart,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface LiquiditaetsplanungPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
  hideSeoContent?: boolean;
}

export const LiquiditaetsplanungPage: React.FC<LiquiditaetsplanungPageProps> = ({
  onOpenBooking,
  lang: propLang,
  hideSeoContent = false,
}) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    applyToolSeo("liquidity", currentLang);
    window.scrollTo(0, 0);
  }, [currentLang]);

  // Time Horizon: 6 or 12 months
  const [horizonMonths, setHorizonMonths] = useState<6 | 12>(6);

  // Core Inputs
  const [startingCash, setStartingCash] = useState<number>(45000); // Bank account in €
  const [currentRevenue, setCurrentRevenue] = useState<number>(50000); // Monthly gross revenue
  const [monthlyGrowthRate, setMonthlyGrowthRate] = useState<number>(8); // % MoM growth
  const [cogsPercent, setCogsPercent] = useState<number>(32); // 32% of sales
  const [inventoryReorderInterval, setInventoryReorderInterval] = useState<1 | 2 | 3 | 4>(2); // Reorder every X months
  const [adSpendPercent, setAdSpendPercent] = useState<number>(30); // % of revenue for Meta/Google Ads
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState<number>(4500); // Salaries, Shopify apps, tools, warehouse
  const [taxReservePercent, setTaxReservePercent] = useState<number>(16); // MwSt & tax reserve %
  const [safetyBuffer, setSafetyBuffer] = useState<number>(15000); // Recommended minimum emergency cash

  // Scenario toggle: Compare standard vs. Procware-optimized (20% lower COGS & 30/70 payment terms)
  const [showProcwareComparison, setShowProcwareComparison] = useState<boolean>(true);

  // Active hover/selected month on graph
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Simulation calculation
  const simulation = useMemo(() => {
    const monthsCount = horizonMonths;
    const monthsList = Array.from({ length: monthsCount }, (_, i) => i + 1);

    // Standard Scenario
    let runningCash = startingCash;
    let minCash = startingCash;
    let minCashMonth = 0;
    let cashOutMonth: number | null = null;

    // Procware Optimized Scenario (-20% COGS via direct factory sourcing)
    const procwareCogsPercent = cogsPercent * 0.8;
    let runningCashProcware = startingCash;

    const timelineData = monthsList.map((m) => {
      // Compounded revenue
      const monthRev = currentRevenue * Math.pow(1 + monthlyGrowthRate / 100, m - 1);
      const adSpend = monthRev * (adSpendPercent / 100);
      const taxReserve = monthRev * (taxReservePercent / 100);

      // Standard inventory calculation
      let inventoryPayment = 0;
      const isReorderMonth = (m - 1) % inventoryReorderInterval === 0;
      if (isReorderMonth) {
        // Reorder for future demand of the interval
        const futureEstimatedRev = monthRev * inventoryReorderInterval;
        inventoryPayment = futureEstimatedRev * (cogsPercent / 100);
      }

      // Procware inventory calculation
      let inventoryPaymentProcware = 0;
      if (isReorderMonth) {
        const futureEstimatedRev = monthRev * inventoryReorderInterval;
        inventoryPaymentProcware = futureEstimatedRev * (procwareCogsPercent / 100);
      }

      const totalOutflow = adSpend + monthlyFixedCosts + taxReserve + inventoryPayment;
      const netCashChange = monthRev - totalOutflow;
      runningCash += netCashChange;

      // Procware outflow
      const totalOutflowProcware = adSpend + monthlyFixedCosts + taxReserve + inventoryPaymentProcware;
      const netCashChangeProcware = monthRev - totalOutflowProcware;
      runningCashProcware += netCashChangeProcware;

      if (runningCash < minCash) {
        minCash = runningCash;
        minCashMonth = m;
      }

      if (runningCash <= 0 && cashOutMonth === null) {
        cashOutMonth = m;
      }

      return {
        month: m,
        revenue: Math.round(monthRev),
        adSpend: Math.round(adSpend),
        inventoryPayment: Math.round(inventoryPayment),
        inventoryPaymentProcware: Math.round(inventoryPaymentProcware),
        fixedCosts: Math.round(monthlyFixedCosts),
        taxReserve: Math.round(taxReserve),
        totalOutflow: Math.round(totalOutflow),
        netCashChange: Math.round(netCashChange),
        endingCash: Math.round(runningCash),
        endingCashProcware: Math.round(runningCashProcware),
        isReorderMonth,
      };
    });

    const runwayMonths = cashOutMonth !== null ? `${cashOutMonth} Monate` : `> ${horizonMonths} Monate`;

    // Monthly data points including Month 0 (Starting Cash)
    const chartPoints = [
      {
        month: 0,
        label: "Start",
        endingCash: startingCash,
        endingCashProcware: startingCash,
        netCashChange: 0,
        inventoryPayment: 0,
        revenue: currentRevenue,
        isReorderMonth: false,
      },
      ...timelineData.map((d) => ({
        month: d.month,
        label: `M${d.month}`,
        endingCash: d.endingCash,
        endingCashProcware: d.endingCashProcware,
        netCashChange: d.netCashChange,
        inventoryPayment: d.inventoryPayment,
        revenue: d.revenue,
        isReorderMonth: d.isReorderMonth,
      })),
    ];

    // Compute Y-axis bounds for SVG chart
    const allValues = chartPoints.flatMap((p) => [
      p.endingCash,
      showProcwareComparison ? p.endingCashProcware : p.endingCash,
      safetyBuffer,
      0,
    ]);
    const maxVal = Math.max(...allValues);
    const minVal = Math.min(...allValues);
    const chartMax = Math.ceil((maxVal * 1.15) / 10000) * 10000;
    const chartMin = minVal < 0 ? Math.floor((minVal * 1.2) / 10000) * 10000 : 0;
    const range = chartMax - chartMin || 1;

    // Procware advantage total cash difference at end of horizon
    const finalStandardCash = timelineData[timelineData.length - 1].endingCash;
    const finalProcwareCash = timelineData[timelineData.length - 1].endingCashProcware;
    const procwareCashAdvantage = finalProcwareCash - finalStandardCash;

    return {
      timelineData,
      chartPoints,
      chartMax,
      chartMin,
      range,
      minCash: Math.round(minCash),
      minCashMonth,
      runwayMonths,
      cashOutMonth,
      isCrisis: minCash < 0,
      isWarning: minCash >= 0 && minCash < safetyBuffer,
      procwareCashAdvantage: Math.round(procwareCashAdvantage),
    };
  }, [
    horizonMonths,
    startingCash,
    currentRevenue,
    monthlyGrowthRate,
    cogsPercent,
    inventoryReorderInterval,
    adSpendPercent,
    monthlyFixedCosts,
    taxReservePercent,
    safetyBuffer,
    showProcwareComparison,
  ]);

  // Selected point for tooltip (default to min cash month or first warning point)
  const activeIndex =
    hoveredMonthIndex !== null
      ? hoveredMonthIndex
      : simulation.minCashMonth > 0
      ? simulation.minCashMonth
      : 1;
  const activePoint = simulation.chartPoints[activeIndex] || simulation.chartPoints[0];

  // SVG Chart coordinate helper
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingLeft = 65;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 35;
  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    const totalPoints = simulation.chartPoints.length;
    return paddingLeft + (index / (totalPoints - 1)) * plotWidth;
  };

  const getY = (val: number) => {
    const fraction = (val - simulation.chartMin) / simulation.range;
    return paddingTop + plotHeight - fraction * plotHeight;
  };

  // Build standard path string
  const standardPoints = simulation.chartPoints.map((pt, idx) => ({
    x: getX(idx),
    y: getY(pt.endingCash),
  }));

  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const standardLinePath = buildSmoothPath(standardPoints);
  const zeroY = getY(0);
  const safetyY = getY(safetyBuffer);

  // Build area path down to zero line or chart bottom
  const areaBottomY = Math.min(getY(simulation.chartMin), getY(0));
  const standardAreaPath = standardPoints.length
    ? `${standardLinePath} L ${standardPoints[standardPoints.length - 1].x} ${areaBottomY} L ${standardPoints[0].x} ${areaBottomY} Z`
    : "";

  // Procware comparison path
  const procwarePoints = simulation.chartPoints.map((pt, idx) => ({
    x: getX(idx),
    y: getY(pt.endingCashProcware),
  }));
  const procwareLinePath = buildSmoothPath(procwarePoints);

  const handleCopy = () => {
    const text = `Procware Liquiditätsplanung für Online Shops (${horizonMonths} Monate):
• Start-Bankguthaben: ${startingCash.toLocaleString("de-DE")} €
• Monatsumsatz: ${currentRevenue.toLocaleString("de-DE")} € (+${monthlyGrowthRate}% Wachstum/Monat)
• Ad Spend: ${adSpendPercent}% | Fixkosten: ${monthlyFixedCosts.toLocaleString("de-DE")} € | Steuern: ${taxReservePercent}%
• Wareneinsatz (COGS): ${cogsPercent}% (Rhythmus: alle ${inventoryReorderInterval} Monate)
---
• Tiefster Kontostand: ${simulation.minCash.toLocaleString("de-DE")} € (Monat ${simulation.minCashMonth})
• Cash Runway: ${simulation.runwayMonths}
• Liquiditätsstatus: ${
      simulation.isCrisis
        ? "AKUTE LIQUIDITÄTSLÜCKE"
        : simulation.isWarning
        ? "WARNUNG (Puffer unterschritten)"
        : "STABIL"
    }
• Cash-Vorteil mit Procware Sourcing: +${simulation.procwareCashAdvantage.toLocaleString("de-DE")} €
Berechnet mit https://procware.io/liquiditaetsplanung-online-shop`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      {/* Hero Header */}
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
              <ToolLanguageSwitcher toolKey="liquidity" currentLang={currentLang} />
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Wallet className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentLang === "en" ? "Working Capital & Cash Flow Simulator" : "Working Capital & Cashflow Rechner"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {currentLang === "en" ? (
                <>Cash Flow & Liquidity Planner for <span className="text-blue-600">Online Stores</span></>
              ) : (
                <>Liquiditätsplanung für <span className="text-blue-600">Online Shops</span></>
              )}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              {currentLang === "en"
                ? "Simulate your cash runway, forecast inventory pre-financing and advertising cash-outs over 6 to 12 months, and prevent growth crunches."
                : "Vermeide die klassische E-Commerce Wachstumsfalle: Visualisiere deine Liquiditätskurve im Zeitverlauf, plane Waren-Vorfinanzierungen und erkenne exakt, wie viele Monate dein Cash-Puffer bei aktuellem Werbe- und Bestelltakt ausreicht."}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* KPI Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Tiefster Kontostand (Cash Dip)
            </span>
            <div
              className={`text-2xl sm:text-3xl font-black mt-1 ${
                simulation.isCrisis
                  ? "text-red-600"
                  : simulation.isWarning
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {simulation.minCash.toLocaleString("de-DE")} €
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Erreicht in <strong>Monat {simulation.minCashMonth}</strong> (Nachbestellung)
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Cash Runway
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
              {simulation.runwayMonths}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {simulation.cashOutMonth !== null
                ? `⚠️ Insolvenzgefahr ab Monat ${simulation.cashOutMonth}`
                : "Solide Deckung über Planungszeitraum"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Mindest-Sicherheitsreserve
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {safetyBuffer.toLocaleString("de-DE")} €
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {simulation.minCash >= safetyBuffer
                ? "✅ Puffer stets eingehalten"
                : "⚠️ Puffer zeitweise unterschritten"}
            </p>
          </div>

          <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 shadow-xs">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Procware Cash-Vorteil</span>
            </span>
            <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
              +{simulation.procwareCashAdvantage.toLocaleString("de-DE")} €
            </div>
            <p className="text-[11px] text-blue-600/80 mt-1">
              Mehr freie Liquidität durch Sourcing-Hebel
            </p>
          </div>
        </div>

        {/* Interactive Liquidity Graph Section (Centerpiece) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
                <LineChart className="w-3.5 h-3.5 text-blue-600" />
                <span>Interaktiver Liquiditätsverlauf</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                Liquiditätskurve & Kontostand-Entwicklung
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visualisiert, wie Wareneinkäufe, Ad Spend und Fixkosten deine Bankreserve belasten.
                Bewege die Maus über die Punkte für Details.
              </p>
            </div>

            {/* Horizon & Comparison Toggles */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setHorizonMonths(6)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    horizonMonths === 6
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  6 Monate
                </button>
                <button
                  onClick={() => setHorizonMonths(12)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    horizonMonths === 12
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/60"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  12 Monate
                </button>
              </div>

              <button
                onClick={() => setShowProcwareComparison(!showProcwareComparison)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                  showProcwareComparison
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Procware Hebel {showProcwareComparison ? "Aktiv" : "Aus"}</span>
              </button>
            </div>
          </div>

          {/* SVG Graph Canvas */}
          <div className="relative mt-6 w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto select-none overflow-visible"
            >
              <defs>
                {/* Standard Gradient Area */}
                <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={simulation.isCrisis ? "#ef4444" : "#10b981"}
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor={simulation.isCrisis ? "#ef4444" : "#10b981"}
                    stopOpacity="0.02"
                  />
                </linearGradient>

                {/* Procware Comparison Gradient */}
                <linearGradient id="procwareGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
                </linearGradient>
              </defs>

              {/* Y-Axis Grid Lines & Labels */}
              {[1, 0.75, 0.5, 0.25, 0].map((ratio) => {
                const val = simulation.chartMin + ratio * simulation.range;
                const yPos = getY(val);
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingLeft}
                      y1={yPos}
                      x2={svgWidth - paddingRight}
                      y2={yPos}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 8}
                      y={yPos + 4}
                      textAnchor="end"
                      className="text-[10px] font-bold fill-slate-400"
                    >
                      {Math.round(val / 1000)}k €
                    </text>
                  </g>
                );
              })}

              {/* Safety Buffer Dashed Line */}
              {safetyY >= paddingTop && safetyY <= svgHeight - paddingBottom && (
                <g>
                  <line
                    x1={paddingLeft}
                    y1={safetyY}
                    x2={svgWidth - paddingRight}
                    y2={safetyY}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={svgWidth - paddingRight}
                    y={safetyY - 5}
                    textAnchor="end"
                    className="text-[10px] font-bold fill-amber-600"
                  >
                    Mindestreserve ({safetyBuffer.toLocaleString("de-DE")} €)
                  </text>
                </g>
              )}

              {/* Zero Line (Insolvency Threshold) */}
              {simulation.chartMin < 0 && zeroY >= paddingTop && (
                <g>
                  <line
                    x1={paddingLeft}
                    y1={zeroY}
                    x2={svgWidth - paddingRight}
                    y2={zeroY}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                  <text
                    x={svgWidth - paddingRight}
                    y={zeroY - 6}
                    textAnchor="end"
                    className="text-[10px] font-black fill-red-600 uppercase tracking-wider"
                  >
                    0 € Liquiditätsgrenze
                  </text>
                </g>
              )}

              {/* Standard Liquidity Area */}
              <path d={standardAreaPath} fill="url(#liquidityGradient)" />

              {/* Procware Comparison Line */}
              {showProcwareComparison && (
                <>
                  <path
                    d={procwareLinePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeDasharray="5 4"
                  />
                  {procwarePoints.map((pt, idx) => (
                    <circle
                      key={`pw-${idx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r="3"
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}
                </>
              )}

              {/* Standard Liquidity Curve */}
              <path
                d={standardLinePath}
                fill="none"
                stroke={simulation.isCrisis ? "#dc2626" : "#059669"}
                strokeWidth="3"
              />

              {/* Active Month Vertical Indicator Bar */}
              {activeIndex !== null && (
                <line
                  x1={getX(activeIndex)}
                  y1={paddingTop}
                  x2={getX(activeIndex)}
                  y2={svgHeight - paddingBottom}
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Data Points */}
              {standardPoints.map((pt, idx) => {
                const isSelected = activeIndex === idx;
                const pointData = simulation.chartPoints[idx];
                const isNegative = pointData.endingCash < 0;
                const isReorder = pointData.isReorderMonth;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onClick={() => setHoveredMonthIndex(idx)}
                    onMouseEnter={() => setHoveredMonthIndex(idx)}
                  >
                    {/* Reorder Pulse ring */}
                    {isReorder && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 10 : 7}
                        fill="#f59e0b"
                        opacity="0.25"
                        className="animate-pulse"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 6 : 4}
                      fill={isNegative ? "#dc2626" : isReorder ? "#f59e0b" : "#059669"}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* X-Axis Label */}
                    <text
                      x={pt.x}
                      y={svgHeight - paddingBottom + 18}
                      textAnchor="middle"
                      className={`text-[9px] sm:text-[11px] select-none ${
                        isSelected ? "font-black fill-slate-950" : "font-semibold fill-slate-400"
                      }`}
                    >
                      {pointData.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Tooltip Card Overlay */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg border border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                    activePoint.endingCash < 0
                      ? "bg-red-500 text-white"
                      : activePoint.isReorderMonth
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {activePoint.label}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {activePoint.month === 0 ? "Startkapital" : `Monat ${activePoint.month}`}
                    </span>
                    {activePoint.isReorderMonth && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                        📦 Warennachbestellung
                      </span>
                    )}
                    {activePoint.endingCash < 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-400/20 text-red-300 font-bold border border-red-400/30">
                        🚨 Liquiditätsengpass
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activePoint.month === 0
                      ? "Ausgangslage auf allen Bank- und Payment-Konten"
                      : `Umsatz: ${activePoint.revenue.toLocaleString("de-DE")} € | Cashflow: ${
                          activePoint.netCashChange >= 0 ? "+" : ""
                        }${activePoint.netCashChange.toLocaleString("de-DE")} €`}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:justify-end">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Kontostand Ende
                  </span>
                  <span
                    className={`text-xl font-black ${
                      activePoint.endingCash < 0 ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {activePoint.endingCash.toLocaleString("de-DE")} €
                  </span>
                </div>

                {showProcwareComparison && (
                  <div className="pl-4 border-l border-slate-800">
                    <span className="text-[10px] uppercase tracking-wider text-blue-400 block font-semibold">
                      Mit Procware
                    </span>
                    <span className="text-xl font-black text-blue-300">
                      {activePoint.endingCashProcware.toLocaleString("de-DE")} €
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Graph Legend */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <span>Aktueller Cashflow-Verlauf</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span>Monate mit Warennachbestellung</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-500 shrink-0" />
                <span>Sicherheitsreserve ({safetyBuffer.toLocaleString("de-DE")} €)</span>
              </div>
              {showProcwareComparison && (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-blue-600 shrink-0" />
                  <span className="text-blue-700 font-bold">Mit Procware Sourcing-Optimierung</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Controls & Detailed Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Parameter & Hebel</span>
              </h3>
              <button
                onClick={() => {
                  setStartingCash(45000);
                  setCurrentRevenue(50000);
                  setMonthlyGrowthRate(8);
                  setCogsPercent(32);
                  setInventoryReorderInterval(2);
                  setAdSpendPercent(30);
                  setMonthlyFixedCosts(4500);
                  setTaxReservePercent(16);
                  setSafetyBuffer(15000);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Zurücksetzen</span>
              </button>
            </div>

            {/* Starting Cash */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="input-starting-cash" className="text-xs font-bold text-slate-900">
                  Aktuelles Bankguthaben (Liquide Mittel)
                </label>
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  <input
                    id="input-starting-cash"
                    type="number"
                    step="1000"
                    min="0"
                    value={startingCash}
                    onChange={(e) => setStartingCash(Math.max(0, Number(e.target.value)))}
                    className="w-20 bg-transparent text-right text-xs font-extrabold text-blue-700 outline-none"
                  />
                  <span className="text-xs font-bold text-blue-600">€</span>
                </div>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={Math.min(250000, Math.max(5000, startingCash))}
                onChange={(e) => setStartingCash(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Summe aller Geschäftskonten, PayPal & Shopify Balance Guthaben.
              </span>
            </div>

            {/* Current Revenue & Growth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Monatsumsatz aktuell
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={currentRevenue}
                    onChange={(e) => setCurrentRevenue(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Wachstum MoM (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={monthlyGrowthRate}
                    onChange={(e) => setMonthlyGrowthRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>
            </div>

            {/* COGS & Reorder Interval */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="input-cogs-percent" className="text-xs font-bold text-slate-900">
                    Wareneinsatzquote / COGS (% vom Umsatz)
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                    <input
                      id="input-cogs-percent"
                      type="number"
                      step="0.5"
                      min="5"
                      max="80"
                      value={cogsPercent}
                      onChange={(e) => setCogsPercent(Math.max(5, Math.min(80, Number(e.target.value))))}
                      className="w-12 bg-transparent text-right text-xs font-extrabold text-slate-950 outline-none"
                    />
                    <span className="text-xs font-bold text-slate-600">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="1"
                  value={cogsPercent}
                  onChange={(e) => setCogsPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-2">
                  Nachbestell-Rhythmus (Bestellzyklus)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((interval) => (
                    <button
                      key={interval}
                      onClick={() => setInventoryReorderInterval(interval as 1 | 2 | 3 | 4)}
                      className={`py-2 px-1 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                        inventoryReorderInterval === interval
                          ? "bg-slate-950 text-white border-slate-950 shadow-xs"
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {interval} {interval === 1 ? "Monat" : "Monate"}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Je seltener bestellt wird, desto höher ist der einmalige Cash-Abfluss pro Order.
                </span>
              </div>
            </div>

            {/* Ad Spend & Fixed Costs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Ad Spend (% vom Umsatz)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="70"
                    step="0.5"
                    value={adSpendPercent}
                    onChange={(e) => setAdSpendPercent(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Fixkosten (Monatlich)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={monthlyFixedCosts}
                    onChange={(e) => setMonthlyFixedCosts(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>
            </div>

            {/* Taxes & Safety Buffer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Steuerrücklage (USt & Ertrag)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="35"
                    value={taxReservePercent}
                    onChange={(e) => setTaxReservePercent(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Sicherheitsreserve (Wunsch)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={safetyBuffer}
                    onChange={(e) => setSafetyBuffer(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 pr-8 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Simulation Table & Procware CTA Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status & Diagnostic Banner */}
            <div
              className={`p-6 rounded-3xl border ${
                simulation.isCrisis
                  ? "bg-red-50 border-red-200 text-red-950"
                  : simulation.isWarning
                  ? "bg-amber-50 border-amber-200 text-amber-950"
                  : "bg-emerald-50 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-4 h-4 rounded-full mt-1 shrink-0 ${
                    simulation.isCrisis
                      ? "bg-red-600"
                      : simulation.isWarning
                      ? "bg-amber-500"
                      : "bg-emerald-600"
                  }`}
                />
                <div className="space-y-1 text-xs">
                  <h4 className="font-extrabold text-sm">
                    {simulation.isCrisis
                      ? `🚨 Achtung: Liquiditätsengpass in Monat ${simulation.cashOutMonth}!`
                      : simulation.isWarning
                      ? "⚠️ Vorsicht: Sicherheitsreserve wird unterschritten"
                      : "✅ Liquiditätsplanung ist stabil und durchfinanziert"}
                  </h4>
                  <p className="leading-relaxed opacity-90">
                    {simulation.isCrisis
                      ? `In Monat ${simulation.cashOutMonth} fallen hohe Auszahlungen für Ware und Ads an, die dein Guthaben aufzehren. Reduziere deine Vorfinanzierungsmenge oder nutze Procware Zahlungsziele.`
                      : simulation.isWarning
                      ? `Dein Kontostand fällt in Monat ${simulation.minCashMonth} auf ${simulation.minCash.toLocaleString(
                          "de-DE"
                        )} €, was unter deiner Wunsch-Reserve von ${safetyBuffer.toLocaleString(
                          "de-DE"
                        )} € liegt.`
                      : `Dein Cashflow deckt auch bei ${monthlyGrowthRate}% Monatswachstum alle Warenbestellungen und Werbekosten souverän ab.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Projection Data Table */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Monatliche Cashflow-Aufschlüsselung ({horizonMonths} Monate)</span>
                </h3>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Kopiert!" : "Kopieren"}</span>
                </button>
              </div>

              <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[480px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="py-2.5">Monat</th>
                      <th className="py-2.5">Umsatz</th>
                      <th className="py-2.5">Wareneinkauf</th>
                      <th className="py-2.5">Ads & Fix</th>
                      <th className="py-2.5 text-right">Cashflow</th>
                      <th className="py-2.5 text-right">Endbestand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {simulation.timelineData.map((m) => {
                      const isMin = m.month === simulation.minCashMonth;
                      return (
                        <tr
                          key={m.month}
                          className={`hover:bg-slate-50 transition-colors ${
                            isMin ? "bg-amber-50/50" : ""
                          }`}
                        >
                          <td className="py-2.5 font-bold text-slate-900">
                            Monat {m.month}
                            {m.isReorderMonth && (
                              <span className="ml-1.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Order
                              </span>
                            )}
                            {isMin && (
                              <span className="ml-1 px-1.5 py-0.2 rounded bg-red-100 text-red-700 text-[10px] font-bold">
                                Tiefpunkt
                              </span>
                            )}
                          </td>
                          <td className="py-2.5">{m.revenue.toLocaleString("de-DE")} €</td>
                          <td className="py-2.5 font-bold text-amber-600">
                            {m.inventoryPayment > 0
                              ? `-${m.inventoryPayment.toLocaleString("de-DE")} €`
                              : "0 €"}
                          </td>
                          <td className="py-2.5 text-slate-500">
                            -{(m.adSpend + m.fixedCosts + m.taxReserve).toLocaleString("de-DE")} €
                          </td>
                          <td
                            className={`py-2.5 text-right font-bold ${
                              m.netCashChange >= 0 ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {m.netCashChange >= 0 ? "+" : ""}
                            {m.netCashChange.toLocaleString("de-DE")} €
                          </td>
                          <td
                            className={`py-2.5 text-right font-black ${
                              m.endingCash < 0
                                ? "text-red-600"
                                : m.endingCash < safetyBuffer
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {m.endingCash.toLocaleString("de-DE")} €
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Procware Growth & Working Capital Card */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 self-start w-fit mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentLang === "en" ? "Inventory Financing & Growth Loans" : "Warenfinanzierung & Kredite für Kunden"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentLang === "en"
                  ? "Procware supports you with Inventory Financing & Growth Loans"
                  : "Warenfinanzierung & Kredite: Procware finanziert deinen Wareneinkauf vor"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {currentLang === "en"
                  ? "Who is a customer with Procware can receive loans directly from us for inventory financing. We actively assist in pre-financing large production batches, so your working capital stays protected and your cash flow never runs dry during fast scaling."
                  : "Wer bei uns Kunde ist, der kann von uns Kredite zur Warenfinanzierung bekommen! Wir unterstützen dich aktiv bei der Vorfinanzierung deiner Warenbestellungen, damit dein Cashflow geschützt bleibt, du nie wieder 'Out of Stock' gehst und dein Shop ungebremst wachsen kann."}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">
                    {currentLang === "en" ? "Working Capital & Financing Check:" : "Warenfinanzierung & Cashflow Check:"}
                  </span>
                  <span className="text-sm font-bold text-blue-400">
                    {currentLang === "en" ? "Talk to a Procware Financing Specialist" : "Kostenlose Vorfinanzierungs-Beratung"}
                  </span>
                </div>
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <span>{currentLang === "en" ? "Book Strategy Meeting" : "Gespräch vereinbaren"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Guide & FAQ */}
      {!hideSeoContent && (
        <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-4">
              Warum scheitern viele wachsende Shopify Stores an der Liquidität?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal mb-4">
              Das Phänomen nennt sich <strong>„Wachstumsfalle“ (Working Capital Trap)</strong>: Wenn ein Store von 30.000 € auf
              100.000 € Monatsumsatz skaliert, müssen rechtzeitig viel größere Warenbestände (MOQs) vorfinanziert werden.
              Fabriken in Übersee verlangen oft 30% bis 50% Anzahlung und den Rest vor Verschiffung, während die Seefracht 4–6 Wochen unterwegs ist.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Gleichzeitig bucht Meta oder Google Ads Werbekosten täglich ab, und Zahlungsanbieter wie Klarna oder Shopify Payments halten Sicherheitsreserven ein.
              Wer seine Liquiditätskurve nicht vorausschauend plant, wird trotz hoher operativer Buchgewinne zahlungsunfähig.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-black text-slate-950 mb-6">
              Häufige Fragen zur Liquiditätsplanung im E-Commerce (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Wie viel Liquiditätspuffer sollte ein Online Shop halten?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Als Faustformel gilt: Mindestens die Fixkosten von <strong>2 bis 3 Monaten</strong> plus das Werbebudget
                  für 30 Tage sollten als eiserne Reserve stets unangetastet auf dem Geschäftskonto liegen.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Wie löst Procware das Problem der Vorfinanzierung?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Procware ermöglicht es Shopify Händlern, mit <strong>0 € Fixkosten</strong> bis zur ersten Bestellung zu starten
                  und bietet maßgeschneiderte Sourcing- und Fulfillment-Konzepte. Durch verhandelte Zahlungsbedingungen und
                  optimierte Lieferzeiten bindest du deutlich weniger Kapital in Übersee-Warenlagern.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-900">
                  Was ist der Unterschied zwischen Gewinn (P&L) und Cashflow?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Der Gewinn (Gewinn- und Verlustrechnung) zeigt, wie rentabel Verkäufe auf dem Papier sind. Der Cashflow hingegen erfasst den tatsächlichen Zeitpunkt der Ein- und Auszahlungen. Weil Waren Monate vor dem Verkauf bezahlt werden müssen, kann ein Store hochprofitabel sein und zeitgleich ein leeres Bankkonto haben.
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
