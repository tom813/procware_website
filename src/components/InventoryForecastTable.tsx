import React, { useState, useMemo } from "react";
import {
  Table,
  Download,
  Share2,
  Check,
  Filter,
  Calendar,
  Layers,
  ArrowUpDown,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  FileSpreadsheet,
} from "lucide-react";
import { Badge } from "./ui/badge";

export interface ForecastPoint {
  day: number;
  stock: number;
  salesToday: number;
  deliveryToday: number;
}

interface InventoryForecastTableProps {
  currentStock: number;
  forecastPoints: ForecastPoint[];
  safetyStock: number;
  reorderPoint: number;
  totalDays: number;
  leadTimeDays: number;
  lang?: "de" | "en";
}

export const InventoryForecastTable: React.FC<InventoryForecastTableProps> = ({
  currentStock,
  forecastPoints,
  safetyStock,
  reorderPoint,
  totalDays,
  leadTimeDays,
  lang = "de",
}) => {
  const isEn = lang === "en";

  // Interval selection: every X days (e.g. 1 = every day, 7 = weekly, 14 = biweekly, 30 = monthly)
  const [intervalDays, setIntervalDays] = useState<number>(7);
  // Always include days where an incoming shipment arrives
  const [alwaysShowDeliveries, setAlwaysShowDeliveries] = useState<boolean>(true);
  // Filter only days with warnings (below ROP or safety stock or out of stock)
  const [onlyWarnings, setOnlyWarnings] = useState<boolean>(false);

  // Copy / Share feedback state
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [copiedTsv, setCopiedTsv] = useState<boolean>(false);

  // Compute filtered table rows based on selected interval
  const tableRows = useMemo(() => {
    if (!forecastPoints || forecastPoints.length === 0) return [];

    const safeInterval = Math.max(1, intervalDays);
    const rows: (ForecastPoint & { isDeliveryDay: boolean; isStartDay: boolean })[] = [];

    const daySet = new Set<number>();

    // 1. Always include Day 0 (Today)
    daySet.add(0);

    // 2. Include every Xth day
    for (let d = safeInterval; d <= totalDays; d += safeInterval) {
      daySet.add(d);
    }

    // 3. Always include last day if not included
    daySet.add(totalDays);

    // 4. Optionally include all delivery days
    if (alwaysShowDeliveries) {
      forecastPoints.forEach((pt) => {
        if (pt.deliveryToday > 0) {
          daySet.add(pt.day);
        }
      });
    }

    // Sort days ascending
    const sortedDays = Array.from(daySet).sort((a, b) => a - b);

    // Map to forecast point items
    for (const d of sortedDays) {
      const pt = forecastPoints.find((p) => p.day === d);
      if (pt) {
        // Filter if onlyWarnings is toggled
        if (onlyWarnings) {
          const isWarning = pt.stock <= reorderPoint;
          if (!isWarning) continue;
        }

        rows.push({
          ...pt,
          isDeliveryDay: pt.deliveryToday > 0,
          isStartDay: pt.day === 0,
        });
      }
    }

    return rows;
  }, [forecastPoints, intervalDays, totalDays, alwaysShowDeliveries, onlyWarnings, reorderPoint]);

  // Helper for determining row status
  const getStatusBadge = (stock: number) => {
    if (stock <= 0) {
      return {
        label: isEn ? "Out of Stock" : "Out of Stock (0 Stk.)",
        className: "bg-red-50 text-red-700 border-red-200 font-bold",
        icon: AlertTriangle,
      };
    }
    if (stock <= safetyStock) {
      return {
        label: isEn ? "Safety Stock Breach" : "Unter Sicherheitsbestand",
        className: "bg-amber-50 text-amber-800 border-amber-300 font-bold",
        icon: AlertTriangle,
      };
    }
    if (stock <= reorderPoint) {
      return {
        label: isEn ? "Below Reorder Point" : "Unter Meldebestand",
        className: "bg-blue-50 text-blue-700 border-blue-200 font-semibold",
        icon: AlertTriangle,
      };
    }
    return {
      label: isEn ? "Adequate" : "Ausreichend gedeckt",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
      icon: CheckCircle2,
    };
  };

  // CSV Export for Excel (.csv with UTF-8 BOM and ; delimiter for seamless Excel open)
  const handleDownloadCsv = () => {
    const safeInterval = Math.max(1, intervalDays);

    // Headers
    const headers = isEn
      ? ["Day", "Month", "Daily Sales (Units)", "Incoming Delivery (Units)", "Projected Stock (Units)", "Safety Stock (Units)", "Reorder Point (Units)", "Status"]
      : ["Tag", "Monat", "Tagesabsatz (Stueck)", "Wareneingang (Stueck)", "Prognostizierter Bestand (Stueck)", "Sicherheitsbestand", "Meldebestand", "Status"];

    const csvLines = [headers.join(";")];

    tableRows.forEach((row) => {
      const monthNumber = Math.floor(row.day / 30) + 1;
      const status =
        row.stock <= 0
          ? isEn ? "Out of Stock" : "Out of Stock"
          : row.stock <= safetyStock
          ? isEn ? "Below Safety Stock" : "Unter Sicherheitsbestand"
          : row.stock <= reorderPoint
          ? isEn ? "Below Reorder Point" : "Unter Meldebestand"
          : isEn ? "Sufficient" : "Ausreichend";

      const line = [
        row.day === 0 ? (isEn ? "Day 0 (Today)" : "Tag 0 (Heute)") : `Tag ${row.day}`,
        `Monat ${monthNumber}`,
        row.salesToday,
        row.deliveryToday > 0 ? row.deliveryToday : 0,
        row.stock,
        safetyStock,
        reorderPoint,
        status,
      ].join(";");

      csvLines.push(line);
    });

    // Add UTF-8 BOM so Excel opens German umlauts and numbers cleanly
    const csvContent = "\uFEFF" + csvLines.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Procware_Bestandsprognose_alle_${safeInterval}_Tage_${totalDays}d.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy TSV for direct paste into Excel or Google Sheets (Ctrl+V)
  const handleCopyForExcel = () => {
    const headers = [
      isEn ? "Day" : "Tag",
      isEn ? "Month" : "Monat",
      isEn ? "Daily Sales" : "Tagesabsatz",
      isEn ? "Inbound Units" : "Wareneingang",
      isEn ? "Ending Stock" : "Lagerbestand",
      isEn ? "Safety Stock" : "Sicherheitsbestand",
      isEn ? "Status" : "Status",
    ];

    const lines = [headers.join("\t")];

    tableRows.forEach((row) => {
      const status =
        row.stock <= 0
          ? isEn ? "Out of Stock" : "Out of Stock"
          : row.stock <= safetyStock
          ? isEn ? "Below Safety Stock" : "Unter Sicherheitsbestand"
          : row.stock <= reorderPoint
          ? isEn ? "Below ROP" : "Unter Meldebestand"
          : isEn ? "OK" : "Ausreichend";

      lines.push(
        [
          row.day,
          Math.floor(row.day / 30) + 1,
          row.salesToday,
          row.deliveryToday,
          row.stock,
          safetyStock,
          status,
        ].join("\t")
      );
    });

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedTsv(true);
    setTimeout(() => setCopiedTsv(false), 2500);
  };

  // Share / Copy Link with summary
  const handleShare = () => {
    const currentUrl = window.location.href;
    const shareText = isEn
      ? `Procware Inventory Forecast Table (${totalDays} Days Horizon, Interval: every ${intervalDays} days):\nCheck the table and forecast here: ${currentUrl}`
      : `Procware Bestandsprognose-Tabelle (${totalDays} Tage Horizont, Intervall: alle ${intervalDays} Tage):\nDetails und Tabelle ansehen: ${currentUrl}`;

    if (navigator.share) {
      navigator
        .share({
          title: isEn ? "Procware Inventory Forecast" : "Procware Bestandsprognose",
          text: shareText,
          url: currentUrl,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareText);
          setCopiedShare(true);
          setTimeout(() => setCopiedShare(false), 2500);
        });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">
                {isEn ? "Day-by-Day Stock Forecast Table" : "Detaillierte Bestandstabelle"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn
                  ? `View projected inventory every ${intervalDays} days, share data, or export directly to Excel.`
                  : `Zeigt den Lagerbestand alle ${intervalDays} Tage an. Freigeben oder direkt als Excel herunterladen.`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Excel Download & Share */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyForExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            title={isEn ? "Copy to clipboard (for Excel / Google Sheets)" : "In Zwischenablage kopieren (für Excel/Sheets)"}
          >
            {copiedTsv ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">{isEn ? "Copied!" : "Kopiert!"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>{isEn ? "Copy Table" : "Tabelle kopieren"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            title={isEn ? "Share forecast link" : "Tabelle & Link freigeben"}
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-700">{isEn ? "Link Copied!" : "Link kopiert!"}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                <span>{isEn ? "Share" : "Freigeben"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            title={isEn ? "Download formatted CSV for Microsoft Excel" : "Als CSV / Excel-Datei herunterladen"}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isEn ? "Download Excel / CSV" : "Excel / CSV Download"}</span>
          </button>
        </div>
      </div>

      {/* Interval Selector Controls & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            {isEn ? "Display stock every:" : "Bestand anzeigen alle:"}
          </span>

          {/* Quick presets */}
          <div className="inline-flex rounded-lg bg-white p-0.5 border border-slate-200 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setIntervalDays(1)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                intervalDays === 1 ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isEn ? "1 Day (Daily)" : "1 Tag (Täglich)"}
            </button>
            <button
              onClick={() => setIntervalDays(3)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                intervalDays === 3 ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              3 {isEn ? "Days" : "Tage"}
            </button>
            <button
              onClick={() => setIntervalDays(7)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                intervalDays === 7 ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              7 {isEn ? "Days (Weekly)" : "Tage (Woche)"}
            </button>
            <button
              onClick={() => setIntervalDays(14)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                intervalDays === 14 ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              14 {isEn ? "Days" : "Tage"}
            </button>
            <button
              onClick={() => setIntervalDays(30)}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                intervalDays === 30 ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              30 {isEn ? "Days (Month)" : "Tage (Monat)"}
            </button>
          </div>

          {/* Custom Days Input */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">{isEn ? "or every" : "oder alle"}</span>
            <input
              type="number"
              min="1"
              max={totalDays}
              value={intervalDays}
              onChange={(e) => setIntervalDays(Math.max(1, Math.min(totalDays, Number(e.target.value) || 1)))}
              className="w-14 px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs font-bold text-center"
            />
            <span className="text-xs text-slate-500">{isEn ? "days" : "Tage"}</span>
          </div>
        </div>

        {/* Toggles: Always show deliveries & warnings */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={alwaysShowDeliveries}
              onChange={(e) => setAlwaysShowDeliveries(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">
              {isEn ? "Always include delivery days" : "Liefertermine immer anzeigen"}
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyWarnings}
              onChange={(e) => setOnlyWarnings(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span className="text-slate-700 font-medium">
              {isEn ? "Only show critical days" : "Nur kritische Tage filtern"}
            </span>
          </label>
        </div>
      </div>

      {/* The Scrollable Responsive Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="max-h-96 overflow-y-auto overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100 text-slate-900 font-bold sticky top-0 z-10 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">{isEn ? "Day" : "Tag"}</th>
                <th className="py-3 px-4 whitespace-nowrap">{isEn ? "Period / Month" : "Zeitraum / Monat"}</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">{isEn ? "Daily Sales" : "Tagesabsatz"}</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">{isEn ? "Inbound Deliveries" : "Wareneingang"}</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">{isEn ? "Projected Stock" : "Lagerbestand"}</th>
                <th className="py-3 px-4 whitespace-nowrap">{isEn ? "Status & Warning" : "Status & Signal"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    {isEn ? "No matching entries for the current filter." : "Keine Einträge für die gewählte Filterung vorhanden."}
                  </td>
                </tr>
              ) : (
                tableRows.map((row) => {
                  const status = getStatusBadge(row.stock);
                  const StatusIcon = status.icon;
                  const monthNum = Math.floor(row.day / 30) + 1;
                  const isStockout = row.stock <= 0;
                  const isBelowSafety = row.stock <= safetyStock && !isStockout;

                  return (
                    <tr
                      key={row.day}
                      className={`hover:bg-slate-50 transition-colors ${
                        row.isStartDay
                          ? "bg-blue-50/40 font-semibold"
                          : row.isDeliveryDay
                          ? "bg-emerald-50/40"
                          : isStockout
                          ? "bg-red-50/40"
                          : isBelowSafety
                          ? "bg-amber-50/30"
                          : ""
                      }`}
                    >
                      {/* Day Column */}
                      <td className="py-2.5 px-4 font-bold text-slate-950 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {row.isStartDay ? (
                            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold">
                              {isEn ? "Today (Day 0)" : "Heute (Tag 0)"}
                            </span>
                          ) : (
                            <span>
                              {isEn ? "Day" : "Tag"} {row.day}
                            </span>
                          )}
                          {row.isDeliveryDay && !row.isStartDay && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Wareneingang" />
                          )}
                        </div>
                      </td>

                      {/* Period Column */}
                      <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                        {isEn ? `Month ${monthNum}` : `Monat ${monthNum}`} (Tag {Math.max(1, (monthNum - 1) * 30 + 1)}–{monthNum * 30})
                      </td>

                      {/* Sales Column */}
                      <td className="py-2.5 px-4 text-right text-slate-600 font-mono whitespace-nowrap">
                        {row.day === 0 ? "—" : `-${row.salesToday.toLocaleString()} Stk.`}
                      </td>

                      {/* Deliveries Column */}
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        {row.deliveryToday > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                            <Truck className="w-3 h-3 text-emerald-700" />
                            +{row.deliveryToday.toLocaleString()} Stk.
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Ending Stock Column */}
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-black font-mono text-sm ${
                            isStockout
                              ? "text-red-600"
                              : isBelowSafety
                              ? "text-amber-600"
                              : "text-slate-900"
                          }`}
                        >
                          {row.stock.toLocaleString()}
                        </span>
                        <span className="text-slate-400 text-[10px] ml-1">Stk.</span>
                      </td>

                      {/* Status Column */}
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-[11px] ${status.className}`}
                        >
                          <StatusIcon className="w-3 h-3 shrink-0" />
                          <span>{status.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            {isEn
              ? `Showing ${tableRows.length} intervals over ${totalDays} days.`
              : `Angezeigt: ${tableRows.length} Datenpunkte über ${totalDays} Tage.`}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {isEn ? "Delivery Day" : "Wareneingang"}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {isEn ? "Safety Stock (≤ " : "Sicherheitsbestand (≤ "}{safetyStock} Stk.)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {isEn ? "Out of Stock (0)" : "Out of Stock (0)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
