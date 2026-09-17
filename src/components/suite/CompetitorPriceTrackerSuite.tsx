import React, { useState, useEffect, useMemo } from "react";
import {
  Tag,
  Plus,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Bell,
  BellOff,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { SuiteLayout } from "./SuiteLayout";
import { MonitoredItem, SnapshotData } from "../../types/intelligence";
import {
  loadProductWatchlist,
  saveProductWatchlist,
  fetchRemoteProductWatchlist,
  deleteProductWatchlistRemote,
  fetchProductPriceAuto,
  QUICK_SELECT_PRODUCT_PRESETS,
} from "../../services/intelligenceService";
import { useCompetitors } from "../../context/CompetitorContext";
import { useAuth } from "../../context/AuthContext";

/**
 * Validates if a URL points to an actual product rather than just a store homepage
 */
function isProductUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const pathname = parsed.pathname.toLowerCase();
    return (
      pathname.includes("/products/") ||
      pathname.includes("/product/") ||
      pathname.includes("/p/") ||
      pathname.includes("/item/") ||
      pathname.includes("/produkt/") ||
      pathname.includes("/dp/") ||
      (pathname.split("/").filter(Boolean).length >= 2 && pathname !== "/")
    );
  } catch {
    return false;
  }
}

export const CompetitorPriceTrackerSuite: React.FC = () => {
  const { user } = useAuth();
  const { competitors, addCompetitor, addProductUrlToCompetitor } = useCompetitors();

  const [watchlist, setWatchlist] = useState<MonitoredItem[]>([]);
  const [inputUrl, setInputUrl] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const userIdentifier = user?.email || user?.id || null;
  const systemEmail = user?.email || "benachrichtigung@dein-shop.de";

  useEffect(() => {
    // Strictly load user-added products for THIS user account (empty by default, isolated per user)
    const list = loadProductWatchlist(userIdentifier);
    setWatchlist(list);
    if (list.length > 0) {
      setExpandedProductId(list[0].id);
    } else {
      setExpandedProductId(null);
    }

    // Also synchronize from Cloud SQL database for logged-in user
    if (userIdentifier) {
      fetchRemoteProductWatchlist(userIdentifier).then((remoteList) => {
        if (remoteList && remoteList.length > 0) {
          setWatchlist(remoteList);
          setExpandedProductId((prev) => prev || remoteList[0].id);
        }
      });
    }
  }, [user?.id, user?.email]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    let cleanUrl = inputUrl.trim();
    if (!cleanUrl) return;

    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // STRICT VALIDATION: Only product URLs allowed, not whole shops!
    if (!isProductUrl(cleanUrl)) {
      setErrorMsg(
        "Hier können nur konkrete Produkt-URLs überwacht werden (z. B. https://snocks.com/products/sneaker-socken). Für ganze Shops nutze bitte den Shopify Sales-Tracker."
      );
      return;
    }

    setIsAdding(true);

    try {
      // Automatically fetch current price and product title
      const extracted = await fetchProductPriceAuto(cleanUrl);
      const title = inputTitle.trim() || extracted.title || `${extracted.domain} Produkt`;
      const price = extracted.price || 29.99;

      const now = new Date().toISOString();
      const newSnapshot: SnapshotData = {
        id: `snap-${Date.now()}`,
        timestamp: now,
        price,
        currency: "EUR",
      };

      const newItem: MonitoredItem = {
        id: `prod-${Date.now()}`,
        itemType: "product",
        url: cleanUrl,
        domain: extracted.domain,
        source: "shopify",
        title,
        category: "Wettbewerber-Produkt",
        imageUrl:
          extracted.imageUrl ||
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
        currency: "EUR",
        createdAt: now,
        lastCheckedAt: now,
        emailAlertsEnabled: emailAlerts,
        alertThresholdPercent: 5,
        snapshots: [newSnapshot],
        currentPrice: price,
        previousPrice: price,
        priceDiff: 0,
        priceDiffPercent: 0,
        estimatedDailySalesUnits: 30,
        estimatedMonthlyRevenue: Math.round(30 * 30 * price),
        salesVelocity: "mittel",
      };

      // Synchronize competitor if available
      const existingComp = competitors.find(
        (c) => c.domain.toLowerCase() === extracted.domain.toLowerCase()
      );
      if (existingComp) {
        addProductUrlToCompetitor(existingComp.id, cleanUrl);
      } else {
        addCompetitor(extracted.domain, undefined, cleanUrl);
      }

      const updated = [newItem, ...watchlist];
      setWatchlist(updated);
      saveProductWatchlist(updated, userIdentifier);
      setExpandedProductId(newItem.id);
      setInputUrl("");
      setInputTitle("");

      setSuccessMsg(
        `Produkt "${newItem.title}" erfolgreich hinzugefügt! Aktueller Preis von ${price.toFixed(
          2
        )} € automatisch erfasst.${
          emailAlerts
            ? ` E-Mail-Alerts werden bei Preisänderungen an ${systemEmail} gesendet.`
            : ""
        }`
      );
    } catch (err: any) {
      setErrorMsg(err.message || "Fehler beim Erfassen des Produkts.");
    } finally {
      setIsAdding(false);
    }
  };

  // Toggle email notification per product after creation
  const handleToggleEmailAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = watchlist.map((item) => {
      if (item.id === id) {
        const nextState = item.emailAlertsEnabled === false ? true : false;
        return { ...item, emailAlertsEnabled: nextState };
      }
      return item;
    });
    setWatchlist(updated);
    saveProductWatchlist(updated, userIdentifier);
  };

  const handleDeleteProduct = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const itemToDelete = watchlist.find((item) => item.id === id);
    const updated = watchlist.filter((item) => item.id !== id);
    setWatchlist(updated);
    saveProductWatchlist(updated, userIdentifier);
    if (itemToDelete?.url) {
      deleteProductWatchlistRemote(itemToDelete.url, userIdentifier);
    }
    if (expandedProductId === id) {
      setExpandedProductId(updated.length > 0 ? updated[0].id : null);
    }
    setSuccessMsg(`Produkt "${title}" wurde erfolgreich gelöscht.`);
  };

  const toggleExpand = (id: string) => {
    setExpandedProductId((prev) => (prev === id ? null : id));
  };

  return (
    <SuiteLayout activeModule="price-tracker">
      <div className="space-y-8">
        {/* Module Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Tag className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Competitor Price Tracker & Alerts
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Überwache konkrete Wettbewerber-Produkt-URLs automatisch. Der Preis wird selbstständig
            gezogen und Preisänderungen werden dir direkt per E-Mail gemeldet.
          </p>
        </div>

        {/* Schnellauswahl oben (Beispiel-Produkt-Presets & Wettbewerber-Produkte) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 px-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Schnellauswahl:</span>
          </span>
          {QUICK_SELECT_PRODUCT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputUrl(preset.url);
                setInputTitle(preset.name);
                setErrorMsg("");
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>{preset.name}</span>
              <span className="text-[10px] text-slate-400">({preset.domain})</span>
            </button>
          ))}
          {competitors.map((comp) => (
            <button
              key={comp.id}
              type="button"
              onClick={() => {
                const url = comp.productUrls[0] || `https://${comp.domain}/products/bestseller`;
                setInputUrl(url);
                setInputTitle(`${comp.name} Produkt`);
                setErrorMsg("");
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>{comp.name}</span>
              <span className="text-[10px] text-slate-400">({comp.domain})</span>
            </button>
          ))}
        </div>

        {/* Add Product URL Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-black text-slate-950 mb-1 flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-emerald-600" />
            <span>Neues Wettbewerber-Produkt zur Überwachung hinzufügen</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Gib eine konkrete Produkt-URL ein (z. B. snocks.com/products/sneaker-socken). Der aktuelle
            Preis wird automatisch ermittelt und fortlaufend getrackt.
          </p>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Produkt-URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://snocks.com/products/sneaker-socken-schwarz..."
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                  Produktname (optional)
                </label>
                <input
                  type="text"
                  placeholder="Wird sonst automatisch erkannt..."
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Email Notification Checkbox */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">
                    Per E-Mail benachrichtigen bei Preisänderungen
                  </span>
                  <span className="text-slate-500 ml-1.5">
                    (an: <strong className="text-slate-700">{systemEmail}</strong>)
                  </span>
                </div>
              </label>

              <button
                type="submit"
                disabled={isAdding || !inputUrl.trim()}
                className="px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Preis wird ermittelt...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Produkt überwachen</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-start gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Monitored Products List (Only real user products, with email toggle, click for graph, delete button) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Deine überwachten Produkte ({watchlist.length})
              </h2>
              <p className="text-xs text-slate-500">
                Klicke auf ein Produkt, um den Preisverlauf über die getrackten Tage als Kurve anzuzeigen.
              </p>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
              Noch keine Produkte hinzugefügt. Trage oben deine erste konkrete Produkt-URL ein oder wähle ein Preset aus der Schnellauswahl.
            </div>
          ) : (
            <div className="space-y-3">
              {watchlist.map((item) => {
                const isExpanded = expandedProductId === item.id;
                const snapshots = item.snapshots || [];
                const isAlertActive = item.emailAlertsEnabled !== false;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all overflow-hidden ${
                      isExpanded
                        ? "bg-slate-50/70 border-emerald-300 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => toggleExpand(item.id)}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <div className="font-extrabold text-sm text-slate-950 truncate flex items-center gap-2">
                            <span>{item.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                            <span className="text-slate-400">{item.domain}</span>
                            <span>•</span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              <span>Produktseite öffnen</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                        {/* Nachträgliche E-Mail-Alert Umschaltung */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleEmailAlert(item.id, e)}
                          title={
                            isAlertActive
                              ? `E-Mail-Alerts aktiv an ${systemEmail} (Klicken zum Deaktivieren)`
                              : "E-Mail-Alerts pausiert (Klicken zum Aktivieren)"
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                            isAlertActive
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {isAlertActive ? (
                            <>
                              <Bell className="w-3.5 h-3.5 text-emerald-600" />
                              <span>E-Mail-Alerts an</span>
                            </>
                          ) : (
                            <>
                              <BellOff className="w-3.5 h-3.5 text-slate-400" />
                              <span>Alerts aus</span>
                            </>
                          )}
                        </button>

                        <div className="text-right">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Aktueller Preis
                          </div>
                          <div className="text-base font-black text-slate-950">
                            {item.currentPrice.toFixed(2)} €
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDeleteProduct(item.id, item.title, e)}
                          title="Produkt löschen"
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Price History Curve */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-200/70 bg-white">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Preisverlauf über die getrackten Tage</span>
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              Exakte Aufzeichnung der unterschiedlichen Erfassungstage für {item.title}
                            </p>
                          </div>

                          {/* Nachträglich E-Mail-Option auch im Detailbereich */}
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isAlertActive}
                                onChange={(e) => handleToggleEmailAlert(item.id, e as any)}
                                className="w-3.5 h-3.5 text-emerald-600 rounded border-slate-300"
                              />
                              <span>Per Mail benachrichtigen ({systemEmail})</span>
                            </label>
                          </div>
                        </div>

                        {/* Price Chart SVG (Guarantees distinct days without duplicates) */}
                        <div className="mt-2 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                          <PriceCurveChart snapshots={snapshots} currentPrice={item.currentPrice} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SuiteLayout>
  );
};

/**
 * Clean SVG curve component rendering product price over days
 * Deduplicates by calendar day so each day appears strictly once!
 */
const PriceCurveChart: React.FC<{ snapshots: SnapshotData[]; currentPrice: number }> = ({
  snapshots,
  currentPrice,
}) => {
  // Sort chronologically and deduplicate by distinct calendar day (taking the latest price of that day)
  const uniqueDaySnaps = useMemo(() => {
    const sorted = [...snapshots].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const byDay = new Map<string, { timestamp: string; price: number; formattedDay: string }>();

    sorted.forEach((snap) => {
      const d = new Date(snap.timestamp);
      const dayKey = d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
      });
      // Store/overwrite latest value for that day
      byDay.set(dayKey, {
        timestamp: snap.timestamp,
        price: snap.price,
        formattedDay: dayKey,
      });
    });

    return Array.from(byDay.values());
  }, [snapshots]);

  if (uniqueDaySnaps.length <= 1) {
    const singleDate = uniqueDaySnaps[0]?.formattedDay || new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
    return (
      <div className="py-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
          <span>Start-Messpunkt ({singleDate}): {currentPrice.toFixed(2)} €</span>
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Das Tracking für dieses Produkt wurde gestartet. Sobald weitere tägliche Messungen an
          unterschiedlichen Tagen durchgeführt werden, wird hier der kontinuierliche Verlauf gezeichnet.
        </p>
      </div>
    );
  }

  const prices = uniqueDaySnaps.map((s) => s.price);
  const minPrice = Math.min(...prices) * 0.95;
  const maxPrice = Math.max(...prices) * 1.05;
  const priceRange = maxPrice - minPrice || 1;

  const width = 700;
  const height = 160;
  const padX = 40;
  const padY = 24;

  const points = uniqueDaySnaps.map((s, idx) => {
    const x = padX + (idx / (uniqueDaySnaps.length - 1)) * (width - padX * 2);
    const normY = (s.price - minPrice) / priceRange;
    const y = height - padY - normY * (height - padY * 2);
    return {
      x,
      y,
      date: s.formattedDay,
      price: s.price,
    };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-40 select-none overflow-visible"
      >
        {/* Horizontal grid guide */}
        <line
          x1={padX}
          y1={height - padY}
          x2={width - padX}
          y2={height - padY}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <line
          x1={padX}
          y1={padY}
          x2={width - padX}
          y2={padY}
          stroke="#f1f5f9"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* The price curve */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />

        {/* Distinct day data points & labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text
              x={p.x}
              y={p.y - 10}
              textAnchor="middle"
              className="text-[11px] font-bold fill-slate-900"
            >
              {p.price.toFixed(2)} €
            </text>
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="text-[10px] font-medium fill-slate-400"
            >
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
