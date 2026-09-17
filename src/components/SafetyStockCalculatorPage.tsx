import React, { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { applyToolSeo } from "../utils/seoUtils";
import { ToolLanguageSwitcher } from "./ToolLanguageSwitcher";
import { InventorySawtoothChart, ScheduledDelivery } from "./InventorySawtoothChart";
import { InventoryForecastTable } from "./InventoryForecastTable";
import {
  Calculator,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Package,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  Calendar,
  RotateCcw,
  Boxes,
  Truck,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface SafetyStockCalculatorPageProps {
  onOpenBooking: () => void;
  lang?: "de" | "en";
  hideSeoContent?: boolean;
}

export const SafetyStockCalculatorPage: React.FC<SafetyStockCalculatorPageProps> = ({
  onOpenBooking,
  lang: propLang,
  hideSeoContent = false,
}) => {
  const location = useLocation();
  const currentLang: "de" | "en" = propLang || (location.pathname.startsWith("/en") ? "en" : "de");

  useEffect(() => {
    applyToolSeo("safetyStock", currentLang);
    window.scrollTo(0, 0);
  }, [currentLang]);

  const isEn = currentLang === "en";

  // 1. Core On-Hand Stock (Tag 0 Startwert)
  const [currentStock, setCurrentStock] = useState<number>(650);

  // 2. Time Horizon: Dynamic months (e.g. 3, 4, 6, 9, 12... up to 24 months)
  const [horizonMonths, setHorizonMonths] = useState<number>(6);

  // 3. Sales Forecast Mode: "generic" (flat monthly average) vs "monthly" (month-by-month values)
  const [salesMode, setSalesMode] = useState<"generic" | "monthly">("monthly");
  const [genericMonthlySales, setGenericMonthlySales] = useState<number>(500);

  // Monthly Sales Array for Months 1 through N (dynamically scalable)
  const [monthlySales, setMonthlySales] = useState<number[]>([500, 400, 600, 550, 500, 450]);

  // 4. Replenishment Deliveries Mode: "recurring" vs "custom"
  const [deliveryMode, setDeliveryMode] = useState<"recurring" | "custom">("custom");

  // Recurring options: "Alle X Tage kommen Y Stück"
  const [recurringIntervalDays, setRecurringIntervalDays] = useState<number>(30);
  const [recurringUnits, setRecurringUnits] = useState<number>(1000);

  // Custom Delivery Schedule (specific days & quantities)
  const [customDeliveries, setCustomDeliveries] = useState<ScheduledDelivery[]>([
    { id: "1", day: 35, units: 1000, label: isEn ? "PO #1 (Restock)" : "Lieferung 1" },
    { id: "2", day: 75, units: 1200, label: isEn ? "PO #2 (Replenish)" : "Lieferung 2" },
  ]);

  // Form state for adding a new custom delivery
  const [newDeliveryDay, setNewDeliveryDay] = useState<number>(110);
  const [newDeliveryUnits, setNewDeliveryUnits] = useState<number>(1000);

  // 5. Lead Time & Safety Stock (Directly editable piece count, e.g. 200 Stk., plus lead time)
  const [leadTimeDays, setLeadTimeDays] = useState<number>(20); // Ø Lieferzeit des Lieferanten in Tagen
  const [safetyStockUnits, setSafetyStockUnits] = useState<number>(200); // Direkt editierbarer Sicherheitsbestand in Stück

  // Copy feedback state
  const [copied, setCopied] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Reset to clean default values
  const handleReset = () => {
    setCurrentStock(650);
    setHorizonMonths(6);
    setSalesMode("monthly");
    setGenericMonthlySales(500);
    setMonthlySales([500, 400, 600, 550, 500, 450]);
    setDeliveryMode("custom");
    setRecurringIntervalDays(30);
    setRecurringUnits(1000);
    setCustomDeliveries([
      { id: "1", day: 35, units: 1000, label: isEn ? "PO #1 (Restock)" : "Lieferung 1" },
      { id: "2", day: 75, units: 1200, label: isEn ? "PO #2 (Replenish)" : "Lieferung 2" },
    ]);
    setLeadTimeDays(20);
    setSafetyStockUnits(200);
  };

  // Dynamic Month Controls: Add, Remove, Set
  const handleAddMonth = () => {
    setHorizonMonths((prev) => {
      const next = Math.min(24, prev + 1);
      setMonthlySales((prevSales) => {
        if (prevSales.length < next) {
          const last = prevSales[prevSales.length - 1] ?? 500;
          return [...prevSales, last];
        }
        return prevSales;
      });
      return next;
    });
  };

  const handleRemoveMonth = () => {
    setHorizonMonths((prev) => Math.max(1, prev - 1));
  };

  const handleSetHorizonMonths = (val: number) => {
    const clamped = Math.max(1, Math.min(24, val));
    setHorizonMonths(clamped);
    setMonthlySales((prevSales) => {
      if (prevSales.length < clamped) {
        const diff = clamped - prevSales.length;
        const last = prevSales[prevSales.length - 1] ?? 500;
        return [...prevSales, ...Array(diff).fill(last)];
      }
      return prevSales;
    });
  };

  // Update a single month's sales in monthly mode
  const updateMonthlySales = (monthIdx: number, val: number) => {
    const next = [...monthlySales];
    next[monthIdx] = Math.max(0, val || 0);
    setMonthlySales(next);
  };

  // Add custom delivery
  const handleAddDelivery = () => {
    if (newDeliveryDay <= 0 || newDeliveryUnits <= 0) return;
    const newDel: ScheduledDelivery = {
      id: Date.now().toString(),
      day: Math.max(1, newDeliveryDay),
      units: Math.max(1, newDeliveryUnits),
      label: isEn ? `PO in ${newDeliveryDay}d` : `Lieferung Tag ${newDeliveryDay}`,
    };
    // Keep deliveries sorted by day
    const updated = [...customDeliveries, newDel].sort((a, b) => a.day - b.day);
    setCustomDeliveries(updated);
    setNewDeliveryDay(Math.min(totalDays, newDeliveryDay + 30));
  };

  // Remove custom delivery
  const handleRemoveDelivery = (id: string) => {
    setCustomDeliveries(customDeliveries.filter((d) => d.id !== id));
  };

  // Total horizon in days
  const totalDays = horizonMonths * 30;

  // Day-by-day calculation and projection curve
  const { forecastPoints, calculations } = useMemo(() => {
    const validCurrentStock = Math.max(0, Number(currentStock) || 0);
    const validLeadDays = Math.max(1, Number(leadTimeDays) || 1);
    const validSafetyStock = Math.max(0, Number(safetyStockUnits) || 0);

    // Compute average daily sales for the reorder point calculation
    let totalSalesOverHorizon = 0;
    for (let m = 0; m < horizonMonths; m++) {
      if (salesMode === "generic") {
        totalSalesOverHorizon += genericMonthlySales;
      } else {
        totalSalesOverHorizon += monthlySales[m] ?? 500;
      }
    }
    const avgDailySales = totalDays > 0 ? totalSalesOverHorizon / totalDays : 0;

    // Safety Stock: Directly user-editable piece count
    const safetyStock = validSafetyStock;

    // Lead Time Demand: Ø Tagesabsatz × Ø Lieferzeit
    const leadTimeDemand = Math.round(avgDailySales * validLeadDays);

    // Meldebestand (Reorder Point / ROP) = Vorlaufbedarf + Sicherheitsbestand
    const reorderPoint = Math.round(leadTimeDemand + safetyStock);

    // Equivalent buffer range in days
    const equivalentBufferDays = avgDailySales > 0 ? Math.round((safetyStock / avgDailySales) * 10) / 10 : 0;

    // Generate Day-by-Day Forecast starting strictly at Tag 0 = validCurrentStock
    const points: {
      day: number;
      stock: number;
      salesToday: number;
      deliveryToday: number;
    }[] = [];

    let runningStock = validCurrentStock;
    let stockoutDay: number | null = null;
    let totalDelivered = 0;

    // Push Day 0 (Today)
    points.push({
      day: 0,
      stock: runningStock,
      salesToday: 0,
      deliveryToday: 0,
    });

    for (let d = 1; d <= totalDays; d++) {
      // Determine today's sales rate based on month
      const monthIdx = Math.min(horizonMonths - 1, Math.floor((d - 1) / 30));
      const monthlyRate = salesMode === "generic" ? genericMonthlySales : (monthlySales[monthIdx] ?? 500);
      const salesToday = Math.round(monthlyRate / 30);

      // Determine today's incoming deliveries
      let deliveryToday = 0;
      if (deliveryMode === "recurring") {
        if (recurringIntervalDays > 0 && d % recurringIntervalDays === 0) {
          deliveryToday = recurringUnits;
        }
      } else {
        const matches = customDeliveries.filter((del) => del.day === d);
        deliveryToday = matches.reduce((sum, item) => sum + item.units, 0);
      }

      totalDelivered += deliveryToday;

      // Update running stock
      runningStock = Math.max(0, runningStock - salesToday + deliveryToday);

      if (runningStock === 0 && stockoutDay === null) {
        stockoutDay = d;
      }

      points.push({
        day: d,
        stock: runningStock,
        salesToday,
        deliveryToday,
      });
    }

    // Days until stock hits 0 if no deliveries were made
    const naturalRunwayDays = avgDailySales > 0 ? validCurrentStock / avgDailySales : 0;
    const isCurrentlyBelowROP = validCurrentStock <= reorderPoint;
    const isCurrentlyBelowSafety = validCurrentStock <= safetyStock;

    return {
      forecastPoints: points,
      calculations: {
        avgDailySales: Math.round(avgDailySales * 10) / 10,
        avgMonthlySales: Math.round(avgDailySales * 30),
        totalSalesOverHorizon,
        totalDelivered,
        safetyStock,
        equivalentBufferDays,
        leadTimeDemand,
        reorderPoint,
        naturalRunwayDays: Math.round(naturalRunwayDays * 10) / 10,
        stockoutDay,
        isCurrentlyBelowROP,
        isCurrentlyBelowSafety,
      },
    };
  }, [
    currentStock,
    horizonMonths,
    salesMode,
    genericMonthlySales,
    monthlySales,
    deliveryMode,
    recurringIntervalDays,
    recurringUnits,
    customDeliveries,
    leadTimeDays,
    safetyStockUnits,
    totalDays,
  ]);

  // Copy Summary Handler
  const handleCopySummary = () => {
    const text = isEn
      ? `📦 PROCWARE INVENTORY & REORDER FORECAST
--------------------------------------------------
• Current Stock on Hand: ${currentStock.toLocaleString("en-US")} units
• Average Daily Sales: ${calculations.avgDailySales} units/day (~${calculations.avgMonthlySales} units/mo)
• Supplier Lead Time: ${leadTimeDays} days
• Safety Stock Buffer: ${calculations.safetyStock.toLocaleString("en-US")} units (~${calculations.equivalentBufferDays} days buffer)
• Reorder Point (Meldebestand): ${calculations.reorderPoint.toLocaleString("en-US")} units
• Stockout Status: ${
          calculations.stockoutDay
            ? `Risk of stockout at Day ${calculations.stockoutDay}!`
            : `Safe — No stockout during the next ${totalDays} days`
        }
• Total Planned Deliveries: ${calculations.totalDelivered.toLocaleString("en-US")} units
--------------------------------------------------
Calculated with https://procware.de/en/safety-stock-calculator`
      : `📦 PROCWARE BESTANDS- & NACHBESTELLPROGNOSE
--------------------------------------------------
• Aktueller Lagerbestand: ${currentStock.toLocaleString("de-DE")} Stück
• Ø Tagesabsatz: ${calculations.avgDailySales} Stück/Tag (~${calculations.avgMonthlySales} Stück/Monat)
• Lieferzeit des Lieferanten: ${leadTimeDays} Tage
• Sicherheitsbestand (Puffer): ${calculations.safetyStock.toLocaleString("de-DE")} Stück (~${calculations.equivalentBufferDays} Tage Puffer)
• Meldebestand (Bestellgrenze): ${calculations.reorderPoint.toLocaleString("de-DE")} Stück
• Out-of-Stock Status: ${
          calculations.stockoutDay
            ? `Achtung: Bestand erreicht 0 an Tag ${calculations.stockoutDay}!`
            : `Stabil — Kein Out-of-Stock in den nächsten ${totalDays} Tagen`
        }
• Geplante Gesamtliefereingänge: ${calculations.totalDelivered.toLocaleString("de-DE")} Stück
--------------------------------------------------
Berechnet mit https://procware.de/safety-stock-calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Language Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link to={isEn ? "/en/tools" : "/tools"} className="hover:text-blue-600 transition-colors">
              {isEn ? "Tools Overview" : "Tools Übersicht"}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">
              {isEn ? "Safety Stock & Reorder Point Calculator" : "Safety Stock & Meldebestand Rechner"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white text-slate-700 border-slate-200 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
              {isEn ? "Operations & Inventory" : "Bestandsmanagement & Logistik"}
            </Badge>
            <ToolLanguageSwitcher toolKey="safetyStock" currentLang={currentLang} />
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{isEn ? "Inventory Forecast & Safety Stock" : "Bestandsprognose & Meldebestand"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {isEn ? (
                  <>
                    Safety Stock & <span className="text-blue-600">Reorder Point</span> Calculator
                  </>
                ) : (
                  <>
                    Safety Stock & <span className="text-blue-600">Meldebestand</span> Rechner
                  </>
                )}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isEn
                  ? "Track your current inventory, plan future monthly sales, schedule incoming shipments, and calculate your exact reorder point."
                  : "Erfasse deinen aktuellen Lagerbestand, plane Verkaufszahlen monatsweise, trage Wareneingänge flexibel ein und berechne deinen exakten Meldebestand."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Werte zurücksetzen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? "Reset" : "Zurücksetzen"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout: Inputs (Left) and Chart & KPIs (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* LEFT COLUMN: Clean, Structured Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* 1. CURRENT STOCK (Aktueller Bestand) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <label className="text-xs font-bold text-slate-950">
                    {isEn ? "Current Stock On-Hand (Units)" : "Aktueller Lagerbestand (in Stück)"}
                  </label>
                </div>
                <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Tag 0: {currentStock} Stk.
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="10"
                value={currentStock}
                onChange={(e) => setCurrentStock(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                {isEn
                  ? "Your inventory curve starts today at exactly this amount."
                  : "Die Verlaufskurve im Graphen startet heute bei exakt dieser Stückzahl."}
              </span>
            </div>

            {/* 2. SALES DEMAND: Generic Flat vs. Month-by-Month */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-950">
                      {isEn ? "Projected Sales Demand" : "Geplante Verkaufszahlen"}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {isEn ? "Flat average or monthly breakdown" : "Pauschal oder Monat für Monat"}
                    </p>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setSalesMode("monthly")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      salesMode === "monthly"
                        ? "bg-white text-slate-950 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isEn ? "Monthly" : "Monatsweise"}
                  </button>
                  <button
                    onClick={() => setSalesMode("generic")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      salesMode === "generic"
                        ? "bg-white text-slate-950 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isEn ? "Flat Ø" : "Pauschal Ø"}
                  </button>
                </div>
              </div>

              {/* Option A: Flat Generic Average */}
              {salesMode === "generic" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isEn ? "Average Sales per Month (Units)" : "Durchschnittlicher Absatz pro Monat (Stk.)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={genericMonthlySales}
                    onChange={(e) => setGenericMonthlySales(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ≈ {Math.round(genericMonthlySales / 30)} {isEn ? "units per day" : "Stück pro Tag"}
                  </span>
                </div>
              ) : (
                /* Option B: Month-by-Month inputs */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>{isEn ? "Month / Period" : "Monat / Zeitraum"}</span>
                    <span>{isEn ? "Sales (Units)" : "Verkauf (Stk.)"}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: horizonMonths }).map((_, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          {isEn ? `Month ${idx + 1}` : `Monat ${idx + 1}`}
                          <span className="text-[10px] text-slate-400 font-normal ml-1">
                            (Tag {idx * 30 + 1}–{(idx + 1) * 30})
                          </span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="25"
                          value={monthlySales[idx] ?? 500}
                          onChange={(e) => updateMonthlySales(idx, Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add / Remove Months Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAddMonth}
                        disabled={horizonMonths >= 24}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isEn ? "+ Add Month" : "+ Monat hinzufügen"}</span>
                      </button>
                      {horizonMonths > 1 && (
                        <button
                          type="button"
                          onClick={handleRemoveMonth}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                          <span>{isEn ? "Remove Last" : "Letzten Monat abwählen"}</span>
                        </button>
                      )}
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      Ø {calculations.avgMonthlySales} {isEn ? "units/mo" : "Stk./Monat"} (
                      {calculations.avgDailySales} {isEn ? "units/day" : "Stk./Tag"})
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. INCOMING DELIVERIES / REPLENISHMENTS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-950">
                      {isEn ? "Scheduled Deliveries / POs" : "Geplante Lieferungen (Wareneingänge)"}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {isEn ? "When will new batches arrive?" : "Wann treffen neue Lieferungen ein?"}
                    </p>
                  </div>
                </div>

                {/* Delivery Mode Selector */}
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                  <button
                    onClick={() => setDeliveryMode("custom")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      deliveryMode === "custom"
                        ? "bg-white text-slate-950 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isEn ? "Specific Days" : "Konkrete Tage"}
                  </button>
                  <button
                    onClick={() => setDeliveryMode("recurring")}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      deliveryMode === "recurring"
                        ? "bg-white text-slate-950 font-bold shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {isEn ? "Regular" : "Regelmäßig"}
                  </button>
                </div>
              </div>

              {/* Delivery Option A: Regular Interval (alle X Tage kommen Y Stück) */}
              {deliveryMode === "recurring" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isEn ? "Interval (Every X Days)" : "Rhythmus (Alle X Tage)"}
                    </label>
                    <input
                      type="number"
                      min="7"
                      max="90"
                      value={recurringIntervalDays}
                      onChange={(e) => setRecurringIntervalDays(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">z.B. alle 30 Tage</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isEn ? "Batch Size (Units)" : "Liefermenge (Stück)"}
                    </label>
                    <input
                      type="number"
                      min="50"
                      step="100"
                      value={recurringUnits}
                      onChange={(e) => setRecurringUnits(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">z.B. 1.000 Stk.</span>
                  </div>
                </div>
              ) : (
                /* Delivery Option B: Specific Days & Quantities (in 40 Tagen X, in 70 Tagen Y) */
                <div className="space-y-3">
                  {/* List of Scheduled Deliveries */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {customDeliveries.length === 0 ? (
                      <div className="p-3 text-center rounded-xl bg-slate-50 text-slate-500 text-xs">
                        {isEn ? "No deliveries scheduled. Stock will deplete continuously." : "Keine Lieferungen geplant. Der Bestand sinkt kontinuierlich."}
                      </div>
                    ) : (
                      customDeliveries.map((del) => (
                        <div
                          key={del.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-bold text-slate-900">
                              {isEn ? `In ${del.day} Days:` : `In ${del.day} Tagen:`}
                            </span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              +{del.units.toLocaleString()} Stk.
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveDelivery(del.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title={isEn ? "Remove delivery" : "Lieferung löschen"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add New Delivery Input Strip */}
                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <span className="text-[11px] font-bold text-indigo-950 block">
                      {isEn ? "+ Schedule New Delivery:" : "+ Neue Lieferung eintragen:"}
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-600 font-medium mb-0.5">
                          {isEn ? "In X Days" : "In X Tagen"}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={totalDays}
                          value={newDeliveryDay}
                          onChange={(e) => setNewDeliveryDay(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                          placeholder="z.B. 40"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-slate-600 font-medium mb-0.5">
                          {isEn ? "Units" : "Menge (Stk.)"}
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="50"
                          value={newDeliveryUnits}
                          onChange={(e) => setNewDeliveryUnits(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                          placeholder="z.B. 1000"
                        />
                      </div>
                      <div className="col-span-1 flex items-end">
                        <button
                          onClick={handleAddDelivery}
                          className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Hinzufügen"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. SUPPLIER LEAD TIME & SAFETY STOCK (Directly editable piece count & buffer days) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-950">
                    {isEn ? "Lead Time & Safety Stock" : "Lieferzeit & Sicherheitsbestand"}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {isEn
                      ? "Directly edit safety stock in pieces or configure buffer days"
                      : "Sicherheitsbestand direkt in Stück editierbar – wird in der Grafik als Linie eingezeichnet"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Lead Time */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isEn ? "Ø Supplier Lead Time (Days)" : "Ø Lieferzeit Lieferant (Tage)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {isEn ? "Order to warehouse arrival" : "Bestellung bis Lagereingang"}
                  </span>
                </div>

                {/* Editable Safety Stock Units */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-amber-900">
                      {isEn ? "Safety Stock (Units)" : "Sicherheitsbestand (Stück)"}
                    </label>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {isEn ? "Chart Line" : "Linie im Chart"}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={safetyStockUnits}
                    onChange={(e) => setSafetyStockUnits(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-amber-50/40 border border-amber-300 text-slate-950 font-black text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>
                      ≈ {calculations.equivalentBufferDays} {isEn ? "days buffer" : "Tage Reichweite"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSafetyStockUnits(Math.round(calculations.avgDailySales * 14))}
                      className="text-amber-700 hover:underline font-semibold cursor-pointer"
                    >
                      {isEn ? "Set to 14 days" : "Auf 14 Tage (Ø)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Clean Single-Curve Graph, KPIs & Order Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Action Bar / Flexible Horizon Selector & Copy Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isEn ? "Forecast Horizon:" : "Zeithorizont:"}
                </span>

                {/* Quick Presets (3, 4, 6, 9, 12 Months) */}
                <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                  {[3, 4, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleSetHorizonMonths(m)}
                      className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                        horizonMonths === m
                          ? "bg-white text-slate-950 font-bold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {m} {isEn ? "Mo." : "Mon."}
                    </button>
                  ))}
                </div>

                {/* Stepper (+ / -) */}
                <div className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
                  <button
                    onClick={handleRemoveMonth}
                    disabled={horizonMonths <= 1}
                    className="px-2 py-1 hover:bg-white rounded-md text-slate-700 cursor-pointer disabled:opacity-30"
                    title={isEn ? "Decrease by 1 month" : "Monat abwählen"}
                  >
                    −
                  </button>
                  <span className="px-2 text-slate-900 font-mono">
                    {horizonMonths}M ({totalDays}d)
                  </span>
                  <button
                    onClick={handleAddMonth}
                    disabled={horizonMonths >= 24}
                    className="px-2 py-1 hover:bg-white rounded-md text-slate-700 cursor-pointer disabled:opacity-30"
                    title={isEn ? "Add 1 month" : "Monat hinzufügen"}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{isEn ? "Copied!" : "Kopiert!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isEn ? "Copy Results" : "Ergebnis kopieren"}</span>
                  </>
                )}
              </button>
            </div>

            {/* TOP 3 STATS CARDS: Meldebestand, Sicherheitsbestand, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 1. Reorder Point (Meldebestand) */}
              <div className="bg-white rounded-2xl p-5 border-2 border-blue-500/40 shadow-xs relative">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                  {isEn ? "Reorder Point (Meldebestand)" : "Meldebestand (Bestellgrenze)"}
                </span>
                <div className="text-3xl font-black text-slate-950 tracking-tight">
                  {calculations.reorderPoint.toLocaleString()}
                  <span className="text-sm font-semibold text-slate-500 ml-1">Stk.</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2 leading-snug">
                  {isEn
                    ? `${calculations.leadTimeDemand} lead demand + ${calculations.safetyStock} buffer`
                    : `${calculations.leadTimeDemand} Vorlaufbedarf + ${calculations.safetyStock} Puffer`}
                </div>
              </div>

              {/* 2. Safety Stock (Sicherheitsbestand) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {isEn ? "Safety Stock Buffer" : "Sicherheitsbestand"}
                </span>
                <div className="text-3xl font-black text-slate-950 tracking-tight">
                  {calculations.safetyStock.toLocaleString()}
                  <span className="text-sm font-semibold text-slate-500 ml-1">Stk.</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-2">
                  <span>≈ {calculations.equivalentBufferDays} {isEn ? "days reserve buffer" : "Tage Notfall-Reserve"}</span>
                </div>
              </div>

              {/* 3. Out-of-Stock Status */}
              <div
                className={`rounded-2xl p-5 border shadow-xs ${
                  calculations.stockoutDay
                    ? "bg-red-50/80 border-red-200 text-red-950"
                    : "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider opacity-80 block mb-1">
                  {isEn ? "Stockout Check" : "Lieferfähigkeit"}
                </span>
                <div className="text-base font-black tracking-tight flex items-center gap-1.5">
                  {calculations.stockoutDay ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{isEn ? `Stockout at Day ${calculations.stockoutDay}!` : `Out-of-Stock an Tag ${calculations.stockoutDay}!`}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{isEn ? "Continuously Supplied" : "Durchgehend lieferfähig"}</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] opacity-90 mt-2 font-medium">
                  {calculations.stockoutDay
                    ? isEn
                      ? `Inventory hits 0 units at day ${calculations.stockoutDay}. Schedule earlier reorder!`
                      : `Bestand erschöpft sich an Tag ${calculations.stockoutDay}. Vorher nachbestellen!`
                    : isEn
                    ? `Sufficient inventory across the full ${totalDays}-day horizon.`
                    : `Geplante Wareneingänge decken den gesamten ${totalDays}-Tage-Zeitraum.`}
                </div>
              </div>
            </div>

            {/* THE NEW CLEAN SINGLE-CURVE CHART */}
            {/* Starts strictly at currentStock at Day 0, drops by sales, jumps on deliveries, NO excess horizontal lines */}
            <InventorySawtoothChart
              currentStock={currentStock}
              forecastPoints={forecastPoints}
              safetyStock={calculations.safetyStock}
              reorderPoint={calculations.reorderPoint}
              totalDays={totalDays}
              lang={currentLang}
            />

            {/* ACTIONABLE SUMMARY CARD */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30 mb-1">
                    <Package className="w-3 h-3 text-blue-400" />
                    {isEn ? "Inventory Status Overview" : "Bestandsanalyse im Überblick"}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {isEn ? "Current Stock vs. Reorder Threshold" : "Aktueller Bestand im Verhältnis zum Meldebestand"}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-blue-400">
                    {currentStock.toLocaleString()} / {calculations.reorderPoint.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 ml-1">Stk.</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {calculations.isCurrentlyBelowROP
                      ? isEn
                        ? "Currently below reorder point!"
                        : "Aktuell unter Meldebestand!"
                      : isEn
                      ? "Currently above reorder point"
                      : "Bestand über Meldebestand"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">{isEn ? "Ø Daily Sales" : "Ø Tagesabsatz"}</span>
                  <span className="font-bold text-white">{calculations.avgDailySales} Stk./Tag</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isEn ? "Lead Time" : "Lieferzeit"}</span>
                  <span className="font-bold text-white">{leadTimeDays} {isEn ? "Days" : "Tage"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isEn ? "Planned Inbound" : "Geplanter Wareneingang"}</span>
                  <span className="font-bold text-emerald-400">+{calculations.totalDelivered.toLocaleString()} Stk.</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">{isEn ? "Buffer Days" : "Puffertage"}</span>
                  <span className="font-bold text-blue-400">~{calculations.equivalentBufferDays} {isEn ? "Days" : "Tage"}</span>
                </div>
              </div>
            </div>

            {/* MATHEMATICAL PROOF BREAKDOWN (Clean, transparent, no blackbox) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                {isEn ? "Exact Mathematical Formula Breakdown" : "Exakter mathematischer Rechenweg"}
              </h3>

              {/* Formula Step 1: Meldebestand */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{isEn ? "1. Reorder Point (Meldebestand) Formula:" : "1. Meldebestand (Reorder Point) Formel:"}</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">ROP = (Ø Absatz × Lieferzeit) + Sicherheitsbestand</Badge>
                </div>
                <div className="text-slate-700 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  Meldebestand = ({calculations.avgDailySales} Stk./Tag × {leadTimeDays} Tage Lieferzeit) + {calculations.safetyStock} Stk. Puffer
                  <br />
                  Meldebestand = {calculations.leadTimeDemand} Stk. + {calculations.safetyStock} Stk. ={" "}
                  <strong className="text-blue-600 font-bold">{calculations.reorderPoint} Stück</strong>
                </div>
              </div>

              {/* Formula Step 2: Sicherheitsbestand */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{isEn ? "2. Safety Stock (Sicherheitsbestand):" : "2. Sicherheitsbestand (Safety Stock):"}</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {isEn ? "Configurable Threshold" : "Direkt konfigurierbarer Schwellenwert"}
                  </Badge>
                </div>
                <div className="text-slate-700 font-mono text-[11px] bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  Sicherheitsbestand = <strong className="text-amber-600 font-bold">{calculations.safetyStock} Stück</strong>
                  <br />
                  <span className="text-slate-500 font-sans text-[11px]">
                    {isEn
                      ? `At Ø ${calculations.avgDailySales} units/day, this provides approx. ${calculations.equivalentBufferDays} days of buffer coverage.`
                      : `Entspricht bei Ø ${calculations.avgDailySales} Stk./Tag einer Puffer-Reichweite von ca. ${calculations.equivalentBufferDays} Tagen.`}
                  </span>
                </div>
              </div>
            </div>

            {/* PROCWARE FULFILLMENT SPOTLIGHT (Pure buffer units reduction, no prices) */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-6 text-white border border-blue-800 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  {isEn ? "The Procware Sourcing & Logistics Advantage" : "Der Procware Logistik-Vorteil"}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                {isEn
                  ? "Shorter Supplier Lead Times = Drastically Lower Buffer Stock"
                  : "Kürzere Lieferzeiten = Drastisch weniger totes Lagervolumen"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {isEn
                  ? `With standard sea freight (${leadTimeDays} days lead time), your reorder point requires ${calculations.reorderPoint} units. Procware's direct express logistics (5-8 days delivery) cuts your lead time demand by more than half — preventing stockouts and lowering required inventory commitments.`
                  : `Bei ${leadTimeDays} Tagen Lieferzeit liegt dein Meldebestand bei ${calculations.reorderPoint} Stück. Mit Procware Express-Fulfillment (5-8 Tage Lieferzeit direkt vom Hersteller) halbiert sich dein Vorlaufbedarf — dein Kapital bleibt flüssig und du verhinderst kostspielige Out-of-Stock-Phasen.`}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="text-xs font-semibold text-blue-200">
                  {isEn ? "Need faster sourcing & fulfillment?" : "Möchtest du deine Lieferkette optimieren?"}
                </div>
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>{isEn ? "Book Free Strategy Call" : "Kostenloses Erstgespräch buchen"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. DAY-BY-DAY INVENTORY FORECAST TABLE (Configurable interval, share & Excel download) */}
        <div className="mb-12">
          <InventoryForecastTable
            currentStock={currentStock}
            forecastPoints={forecastPoints}
            safetyStock={calculations.safetyStock}
            reorderPoint={calculations.reorderPoint}
            totalDays={totalDays}
            leadTimeDays={leadTimeDays}
            lang={currentLang}
          />
        </div>

        {/* PRACTICAL FAQ & GUIDE */}
        {!hideSeoContent && (
          <>
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs mb-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                {isEn ? "Knowledge Base" : "Wissen & Formeln"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {isEn
                  ? "Meldebestand & Safety Stock Explained"
                  : "Meldebestand & Safety Stock einfach erklärt"}
              </h2>
            </div>

            {/* 2-Column Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-950 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  {isEn ? "Reorder Point (Meldebestand)" : "Meldebestand (Reorder Point)"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {isEn
                    ? "The inventory level that signals it is time to place a new order. Covers sales during lead time plus safety buffer."
                    : "Der Schwellenwert, bei dem sofort eine Nachbestellung ausgelöst werden muss. Deckt den Absatz während der Lieferzeit plus Sicherheitsreserve ab."}
                </p>
                <div className="font-mono text-xs text-blue-700 font-bold bg-white p-2 rounded-lg border border-slate-200">
                  Meldebestand = (Tagesabsatz × Lieferzeit) + Sicherheitsbestand
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-950 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  {isEn ? "Safety Stock (Sicherheitsbestand)" : "Sicherheitsbestand (Safety Stock)"}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {isEn
                    ? "Buffer stock protecting against unexpected demand spikes or supplier delays."
                    : "Der Notfall-Puffer gegen unerwartet hohe Verkäufe und Verspätungen beim Lieferanten oder Zoll."}
                </p>
                <div className="font-mono text-xs text-blue-700 font-bold bg-white p-2 rounded-lg border border-slate-200">
                  Sicherheitsbestand = Tagesabsatz × Sicherheits-Puffertage
                </div>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-950">
                {isEn ? "Frequently Asked Questions" : "Häufige Fragen"}
              </h3>

              {[
                {
                  qDe: "Was ist der Unterschied zwischen Meldebestand und Sicherheitsbestand?",
                  qEn: "What is the difference between Reorder Point and Safety Stock?",
                  aDe: "Der Sicherheitsbestand ist die eiserne Reserve, die im Idealfall nie angetastet wird. Der Meldebestand ist die Bestellgrenze: Er setzt sich zusammen aus dem regulären Bedarf während der Lieferzeit PLUS dem Sicherheitsbestand.",
                  aEn: "Safety stock is the permanent emergency buffer. The reorder point is the operational trigger point, combining lead time demand plus the safety stock buffer.",
                },
                {
                  qDe: "Wie berechnet man den täglichen Absatz bei schwankenden Monatszahlen?",
                  qEn: "How is daily sales calculated with varying monthly volumes?",
                  aDe: "Der Rechner teilt die jeweiligen Monatsverkäufe durch 30 Tage und berechnet daraus den tagesgenauen Abverkauf sowie den Gesamtdurchschnitt über den Zeithorizont.",
                  aEn: "The calculator divides monthly sales by 30 days to calculate day-by-day depletion and the overall average across your chosen time horizon.",
                },
                {
                  qDe: "Wie kann man den Sicherheitsbestand reduzieren, ohne Out-of-Stock zu gehen?",
                  qEn: "How can you reduce Safety Stock without risking stockouts?",
                  aDe: "Durch Verkürzung der Lieferzeit (Lead Time). Partner wie Procware mit 5-8 Tagen Express-Fulfillment statt 35-45 Tagen Seefracht senken den benötigten Pufferbestand um bis zu 70 %.",
                  aEn: "By shortening supplier lead times. Procware's direct express logistics (5-8 days vs. 35-45 days sea freight) reduces required buffer inventory by up to 70%.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>{isEn ? faq.qEn : faq.qDe}</span>
                    <span className="text-slate-400 font-bold">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {isEn ? faq.aEn : faq.aDe}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-slate-950 p-8 sm:p-12 text-white border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-300 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{isEn ? "Direct Sourcing & Express Logistics" : "Direktes Sourcing & Express-Logistik"}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEn
                ? "Eliminate Stockouts & Reduce Buffer Inventory"
                : "Nie wieder Out-of-Stock: Schnellere Lieferzeiten mit Procware"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isEn
                ? "Connect your Shopify store: verified manufacturers, pre-shipment inspection, and 5-8 day direct worldwide fulfillment."
                : "Geprüfte Fabriken, Qualitätskontrolle vor Ort und 5-8 Tage weltweites Express-Fulfillment direkt für deinen Shopify Store."}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all cursor-pointer"
              >
                <span>{isEn ? "Book Free Consultation" : "Kostenloses Erstgespräch buchen"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to={isEn ? "/en/tools" : "/tools"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all"
              >
                <span>{isEn ? "All E-Commerce Tools" : "Alle E-Commerce Tools ansehen"}</span>
              </Link>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};
