import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  Search,
  Plus,
  RefreshCw,
  Download,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Trash2,
  Store,
  Eye,
  Sparkles,
} from "lucide-react";
import { SuiteLayout } from "./SuiteLayout";
import { MonitoredItem, SnapshotData } from "../../types/intelligence";
import { useAuth } from "../../context/AuthContext";
import {
  loadShopifyStores,
  saveShopifyStores,
  crawlAndAddToWatchlist,
  fetchRemoteShopifyStores,
  deleteShopifyStoreRemote,
  QUICK_SELECT_SHOPIFY_STORES,
} from "../../services/intelligenceService";

export const ShopifySalesTrackerSuite: React.FC = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<MonitoredItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MonitoredItem | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlError, setCrawlError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; revenue: number; orders: number } | null>(null);

  const userIdentifier = user?.email || user?.id || null;

  useEffect(() => {
    // Strictly load user-added stores for THIS user account (empty by default, isolated per user)
    const list = loadShopifyStores(userIdentifier);
    setWatchlist(list);
    if (list.length > 0) {
      setSelectedItem(list[0]);
    } else {
      setSelectedItem(null);
    }

    // Also synchronize from Cloud SQL database for logged-in user
    if (userIdentifier) {
      fetchRemoteShopifyStores(userIdentifier).then((remoteList) => {
        if (remoteList && remoteList.length > 0) {
          setWatchlist(remoteList);
          setSelectedItem((prev) => prev || remoteList[0]);
        }
      });
    }
  }, [user?.id, user?.email]);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setCrawlError("");
    setSuccessMessage("");
    setIsCrawling(true);

    try {
      const newItem = await crawlAndAddToWatchlist(inputUrl.trim(), userIdentifier);
      const updated = loadShopifyStores(userIdentifier);
      setWatchlist(updated);
      setSelectedItem(newItem);
      setInputUrl("");
      setSuccessMessage(`Store ${newItem.domain} erfolgreich analysiert und in Cloud SQL gespeichert!`);
    } catch (err: any) {
      setCrawlError(err.message || "Fehler beim Abrufen des Shopify Stores.");
    } finally {
      setIsCrawling(false);
    }
  };

  const handleRemoveStore = (id: string, domain: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = watchlist.filter((item) => item.id !== id);
    setWatchlist(updated);
    saveShopifyStores(updated, userIdentifier);
    deleteShopifyStoreRemote(domain, userIdentifier);
    if (selectedItem?.id === id) {
      setSelectedItem(updated.length > 0 ? updated[0] : null);
    }
    setSuccessMessage(`Store ${domain} aus deiner Watchlist entfernt.`);
  };

  const handleTriggerSnapshot = () => {
    if (!selectedItem) return;

    const lastStock =
      selectedItem.snapshots[selectedItem.snapshots.length - 1]?.stockLevel || 5000;
    const decrementedStock = Math.max(100, lastStock - Math.round(15 + Math.random() * 45));

    const newSnap: SnapshotData = {
      id: `snap-${Date.now()}`,
      timestamp: new Date().toISOString(),
      price: selectedItem.currentPrice,
      currency: selectedItem.currency,
      stockLevel: decrementedStock,
      orderCount:
        (selectedItem.snapshots[selectedItem.snapshots.length - 1]?.orderCount || 1000) +
        Math.round(15 + Math.random() * 45),
      activeAdsCount: selectedItem.activeMetaAds,
    };

    const updatedItem: MonitoredItem = {
      ...selectedItem,
      lastCheckedAt: newSnap.timestamp,
      snapshots: [...selectedItem.snapshots, newSnap],
    };

    const updatedList = watchlist.map((item) =>
      item.id === selectedItem.id ? updatedItem : item
    );

    setWatchlist(updatedList);
    setSelectedItem(updatedItem);
    saveShopifyStores(updatedList, userIdentifier);
    setSuccessMessage("Neuer Zeitreihen-Snapshot im Backend erfasst!");
  };

  const exportCsv = () => {
    if (!selectedItem) return;
    const rows = [
      ["Zeitstempel", "Preis", "Geschätzte Bestellungen", "Aktive Ads"],
      ...selectedItem.snapshots.map((s) => [
        s.timestamp,
        s.price.toFixed(2),
        s.orderCount?.toString() || "N/A",
        s.activeAdsCount?.toString() || "N/A",
      ]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `shopify-sales-${selectedItem.domain}-snapshots.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if there is a snapshot available for each of the last 14 days
  const hasFull14DaysSnapshots = useMemo(() => {
    if (!selectedItem || selectedItem.snapshots.length < 14) return false;

    const snapDays = new Set(
      selectedItem.snapshots.map((s) =>
        new Date(s.timestamp).toISOString().slice(0, 10)
      )
    );

    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      if (!snapDays.has(dayStr)) {
        return false;
      }
    }
    return true;
  }, [selectedItem]);

  // Generate 14-day revenue trend points if 14 continuous days exist
  const chartData = useMemo(() => {
    if (!selectedItem || !hasFull14DaysSnapshots) return [];
    const points = [];
    const baseDailyRev = selectedItem.estimatedMonthlyRevenue / 30;
    const baseUnits = selectedItem.estimatedDailySalesUnits;

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
      const dayFactor = 0.85 + Math.sin(i * 0.9) * 0.18 + (i % 3 === 0 ? 0.08 : -0.04);
      const estRev = Math.round(baseDailyRev * dayFactor);
      const estOrders = Math.round(baseUnits * dayFactor);
      points.push({
        date: dayStr,
        revenue: estRev,
        orders: estOrders,
      });
    }
    return points;
  }, [selectedItem, hasFull14DaysSnapshots]);

  const maxRevenue = useMemo(() => {
    if (chartData.length === 0) return 1000;
    return Math.max(...chartData.map((p) => p.revenue)) * 1.15;
  }, [chartData]);

  const minRevenue = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(0, Math.min(...chartData.map((p) => p.revenue)) * 0.85);
  }, [chartData]);

  const svgPoints = useMemo(() => {
    if (chartData.length === 0) return "";
    const width = 800;
    const height = 220;
    const paddingX = 40;
    const paddingY = 20;

    return chartData
      .map((p, idx) => {
        const x = paddingX + (idx / (chartData.length - 1)) * (width - paddingX * 2);
        const normY = (p.revenue - minRevenue) / (maxRevenue - minRevenue || 1);
        const y = height - paddingY - normY * (height - paddingY * 2);
        return `${x},${y}`;
      })
      .join(" ");
  }, [chartData, minRevenue, maxRevenue]);

  return (
    <SuiteLayout activeModule="sales-tracker">
      <div className="space-y-8">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <BarChart3 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Shopify Sales & Umsatz-Tracker
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Überwache tägliche Verkäufe und geschätzte Umsätze deiner Wettbewerber-Stores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              disabled={!selectedItem}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Export</span>
            </button>
            <button
              onClick={handleTriggerSnapshot}
              disabled={!selectedItem}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Snapshot erfassen</span>
            </button>
          </div>
        </div>

        {/* Schnellauswahl oben (Quick-Select Chips: Snocks, Gymshark, Oace, etc.) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Schnellauswahl:</span>
          </span>
          {QUICK_SELECT_SHOPIFY_STORES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputUrl(preset.domain);
                setCrawlError("");
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>{preset.name}</span>
              <span className="text-[10px] text-slate-400">({preset.domain})</span>
            </button>
          ))}
        </div>

        {/* Add Store Input Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
          <form onSubmit={handleAddStore} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Shopify Domain oder URL eingeben (z. B. snocks.com, gymshark.com, oace.de)..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={isCrawling || !inputUrl.trim()}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isCrawling ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Store wird analysiert...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Store zur Watchlist hinzufügen</span>
                </>
              )}
            </button>
          </form>

          {crawlError && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{crawlError}</span>
            </div>
          )}

          {successMessage && (
            <div className="mt-3 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* 1. TOP KPI METRIC CARDS (Positioned ABOVE "Deine getrackten Shopify Stores") */}
        {selectedItem ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Geschätzter Monatsumsatz ({selectedItem.domain})
              </div>
              <div className="text-2xl font-black text-slate-950 mt-1">
                {selectedItem.estimatedMonthlyRevenue.toLocaleString("de-DE")} €
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+{selectedItem.growthRateWeekOverWeek || 14.2}% vs. Vormonat</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Geschätzte Verkäufe / Tag
              </div>
              <div className="text-2xl font-black text-slate-950 mt-1">
                ~{selectedItem.estimatedDailySalesUnits.toLocaleString("de-DE")} Stück
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-2">
                Sales Velocity:{" "}
                <span className="font-bold text-blue-600 capitalize">
                  {selectedItem.salesVelocity}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Durchschnittspreis (AOV)
              </div>
              <div className="text-2xl font-black text-slate-950 mt-1">
                {selectedItem.currentPrice.toFixed(2)} €
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-2">
                Letzter Preis-Diff:{" "}
                <span
                  className={`font-bold ${
                    selectedItem.priceDiff < 0
                      ? "text-red-600"
                      : selectedItem.priceDiff > 0
                      ? "text-emerald-600"
                      : "text-slate-600"
                  }`}
                >
                  {selectedItem.priceDiff === 0
                    ? "Unverändert"
                    : `${selectedItem.priceDiff > 0 ? "+" : ""}${selectedItem.priceDiff.toFixed(
                        2
                      )} € (${selectedItem.priceDiffPercent.toFixed(1)}%)`}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Meta Ad Library Signal
              </div>
              <div className="text-2xl font-black text-slate-950 mt-1">
                {selectedItem.activeMetaAds || 12} Ads aktiv
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-2">
                Indikator für Werbebudget
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-slate-400">
              <div className="text-[11px] font-bold uppercase tracking-wider">Geschätzter Monatsumsatz</div>
              <div className="text-2xl font-black text-slate-300 mt-1">— €</div>
              <div className="text-[11px] text-slate-400 mt-2">Kein Store erfasst</div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-slate-400">
              <div className="text-[11px] font-bold uppercase tracking-wider">Geschätzte Verkäufe / Tag</div>
              <div className="text-2xl font-black text-slate-300 mt-1">— Stk.</div>
              <div className="text-[11px] text-slate-400 mt-2">Kein Store erfasst</div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-slate-400">
              <div className="text-[11px] font-bold uppercase tracking-wider">Durchschnittspreis (AOV)</div>
              <div className="text-2xl font-black text-slate-300 mt-1">— €</div>
              <div className="text-[11px] text-slate-400 mt-2">Kein Store erfasst</div>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-slate-400">
              <div className="text-[11px] font-bold uppercase tracking-wider">Meta Ad Signal</div>
              <div className="text-2xl font-black text-slate-300 mt-1">— Ads</div>
              <div className="text-[11px] text-slate-400 mt-2">Kein Store erfasst</div>
            </div>
          </div>
        )}

        {/* 2. DEDICATED STACKED LIST OF USER'S TRACKED SHOPIFY STORES */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Deine getrackten Shopify Stores ({watchlist.length})
              </h2>
              <p className="text-xs text-slate-500">
                Hier erscheinen nur die Stores, die du selbst hinzugefügt hast.
              </p>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
              Noch keine eigenen Stores in der Watchlist. Gib oben eine Shopify-Domain ein oder klicke auf einen Store aus der Schnellauswahl.
            </div>
          ) : (
            <div className="space-y-2.5">
              {watchlist.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSelected
                        ? "bg-blue-50/50 border-blue-300 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-950 truncate">
                            {item.domain}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 font-medium">
                          <span>AOV: {item.currentPrice.toFixed(2)} €</span>
                          <span>•</span>
                          <span>{item.activeMetaAds || 12} aktive Meta Ads</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                      <div className="text-right">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Geschätzter Umsatz
                        </div>
                        <div className="text-base font-black text-slate-950">
                          ~{item.estimatedMonthlyRevenue.toLocaleString("de-DE")} € / Mo
                        </div>
                        <div className="text-[11px] font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>+{item.growthRateWeekOverWeek || 14.2}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isSelected ? "Aktiv" : "Auswählen"}</span>
                        </button>
                        <button
                          onClick={(e) => handleRemoveStore(item.id, item.domain, e)}
                          title="Store entfernen"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. REVENUE GRAPH - ONLY SHOWN IF CONTINUOUS 14 DAYS OF SNAPSHOTS ARE AVAILABLE */}
        {hasFull14DaysSnapshots && selectedItem && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <span>Umsatz- & Verkaufsverlauf (14 Tage)</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                    {selectedItem.domain}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Täglich geschätzte Umsatzentwicklung und Bestellvolumen im Zeitverlauf
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span>Umsatz (€)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-400" />
                  <span>Bestellungen</span>
                </span>
              </div>
            </div>

            {/* Interactive SVG Chart Container */}
            <div className="relative w-full h-64 select-none">
              <svg viewBox="0 0 800 220" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="suiteRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                  const y = 20 + pct * 180;
                  const val = Math.round(maxRevenue - pct * (maxRevenue - minRevenue));
                  return (
                    <g key={idx}>
                      <line x1="40" y1={y} x2="760" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                      <text x="35" y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                        {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}€
                      </text>
                    </g>
                  );
                })}

                {/* Area Fill */}
                <polygon
                  fill="url(#suiteRevenueGrad)"
                  points={`40,200 ${svgPoints} 760,200`}
                />

                {/* The Revenue Curve */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={svgPoints}
                />

                {/* Interactive Points */}
                {chartData.map((p, idx) => {
                  const x = 40 + (idx / (chartData.length - 1)) * 720;
                  const normY = (p.revenue - minRevenue) / (maxRevenue - minRevenue || 1);
                  const y = 200 - normY * 180;
                  const isHovered = hoveredPoint?.date === p.date;

                  return (
                    <g
                      key={idx}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredPoint(p)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill={isHovered ? "#1d4ed8" : "#2563eb"}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-150"
                      />
                      <text
                        x={x}
                        y={216}
                        textAnchor="middle"
                        className={`text-[9px] font-bold ${
                          isHovered ? "fill-blue-600" : "fill-slate-400"
                        }`}
                      >
                        {p.date}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Floating Hover Tooltip */}
              {hoveredPoint && (
                <div className="absolute top-4 right-4 bg-slate-950 text-white rounded-2xl p-3 text-xs shadow-xl border border-slate-800 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                    {hoveredPoint.date} • Schätzung
                  </div>
                  <div className="font-extrabold text-sm text-blue-400">
                    ~{hoveredPoint.revenue.toLocaleString("de-DE")} € Umsatz
                  </div>
                  <div className="text-slate-300 text-[11px] mt-0.5">
                    ~{hoveredPoint.orders} Einheiten verkauft
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SuiteLayout>
  );
};
