import React, { useState, useMemo } from "react";
import {
  Flame,
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { SuiteLayout } from "./SuiteLayout";
import { TrendingProductItem } from "../../types/intelligence";
import { TRENDING_PRODUCTS_CATALOG } from "../../services/intelligenceService";

export const TrendingProductsSuite: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhase, setSelectedPhase] = useState("all");
  const [minGrowth, setMinGrowth] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<TrendingProductItem | null>(null);
  const [sourcingSuccess, setSourcingSuccess] = useState(false);

  const categories = [
    { id: "all", label: "Alle Kategorien" },
    { id: "Health & Ergonomics", label: "Gesundheit & Ergonomie" },
    { id: "Home & Decor", label: "Wohnen & Haushalt" },
    { id: "Beauty & Personal Care", label: "Beauty & Pflege" },
    { id: "Pet Supplies", label: "Haustierbedarf" },
    { id: "Tech & Gadgets", label: "Technik & Gadgets" },
  ];

  const filteredProducts = useMemo(() => {
    return TRENDING_PRODUCTS_CATALOG.filter((item) => {
      if (
        searchQuery &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (selectedPhase !== "all" && item.trendPhase !== selectedPhase) {
        return false;
      }
      if (item.growthRatePercent < minGrowth) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedPhase, minGrowth]);

  const handleRequestSourcing = (product: TrendingProductItem) => {
    setSelectedProduct(product);
    setSourcingSuccess(true);
  };

  return (
    <SuiteLayout activeModule="trending-products">
      <div className="space-y-6">
        {/* Module Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Flame className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                Trending Products Finder
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Finde ungesättigte Gewinnerprodukte anhand von 7-Tage-Bestellwachstumsraten vor der Marktsättigung.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Trend-Feed aktiv</span>
            </span>
          </div>
        </div>

        {/* Algorithm Principle Notice */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed font-medium">
            <span className="font-bold">Trend-Erkennungs-Prinzip:</span> Wir bewerten Produkte nicht nach der reinen absoluten Bestellzahl, sondern primär nach der <span className="underline decoration-blue-400 font-bold">Wachstumsrate</span> (Bestellungen letzte 7 Tage vs. die 7 Tage davor). So werden explosionsartige Nachfrage-Spikes identifiziert, bevor der Markt mit Konkurrenten überschwemmt ist.
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Produkte durchsuchen (z. B. Humidifier, Pillow, Charger)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-700 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-700 cursor-pointer"
              >
                <option value="all">Alle Trendphasen</option>
                <option value="early_breakout">⚡ Früher Ausbruch (&gt;100% WoW)</option>
                <option value="high_growth">🔥 Starkes Wachstum</option>
                <option value="maturing">📦 Etabliert</option>
              </select>

              <select
                value={minGrowth}
                onChange={(e) => setMinGrowth(Number(e.target.value))}
                className="px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-700 cursor-pointer"
              >
                <option value={0}>Min. Wachstum: Alle</option>
                <option value={50}>Min. +50% 7-Tage-Wachstum</option>
                <option value={100}>Min. +100% 7-Tage-Wachstum</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isBreakout = product.growthRatePercent >= 100;
            const phaseLabel =
              product.trendPhase === "early_breakout"
                ? "⚡ Früher Ausbruch"
                : product.trendPhase === "high_growth"
                ? "🔥 Starkes Wachstum"
                : "📦 Etabliert";

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-wider">
                        {product.category}
                      </span>
                      {isBreakout && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-slate-950" />
                          <span>Breakout</span>
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md shadow-xs text-xs font-extrabold text-slate-900 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                      <span>+{product.growthRatePercent.toFixed(1)}% WoW</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <h3 className="font-extrabold text-slate-950 text-sm line-clamp-2 leading-snug">
                      {product.title}
                    </h3>

                    {/* Order Velocity Breakdown */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Letzte 7 Tage:</span>
                        <span className="font-extrabold text-slate-950">
                          {product.ordersLast7d.toLocaleString("de-DE")} Orders
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Vorherige 7 Tage:</span>
                        <span className="font-bold text-slate-600">
                          {product.ordersPrev7d.toLocaleString("de-DE")} Orders
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500 font-medium">Meta Ads Signal:</span>
                        <span className="font-bold text-blue-600">
                          {product.activeMetaAds} aktive Ads
                        </span>
                      </div>
                    </div>

                    {/* Factual Metrics: Shop VK, Phase & Total Orders (No speculative EKA) */}
                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Aktueller VK-Preis
                        </div>
                        <div className="text-xs font-black text-slate-900 mt-0.5">
                          {product.price.toFixed(2)} €
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Trend-Status
                        </div>
                        <div className="text-xs font-black text-amber-700 mt-0.5 truncate">
                          {phaseLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action CTA: Produkt bei Procware anfragen */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleRequestSourcing(product)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Produkt bei Procware anfragen</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sourcing Modal Feedback (Without fictitious EKA) */}
        {sourcingSuccess && selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-slate-200 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-950">
                Sourcing-Anfrage für {selectedProduct.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Unser deutsches Vor-Ort-Team in Ningbo & Yiwu holt für dich maßgeschneiderte Fabrikangebote mit Qualitätsprüfung und Zollabwicklung ein.
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left font-medium space-y-1.5 text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Individuelle Fabrikkonditionen & Verhandlung ab 0 € Fixkosten</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Branded Packaging, Beilagen & Qualitätskontrolle</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span>Express-Luftfracht & deutsches Fulfillment</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSourcingSuccess(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Schließen
                </button>
                <a
                  href="https://calendly.com/team-procware/new-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Gespräch buchen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuiteLayout>
  );
};
