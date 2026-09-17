import React from "react";
import {
  Tag,
  Package,
  Layers,
  ShoppingBag,
  RotateCcw,
  Boxes,
  MessageSquare,
  Search,
  Settings,
  BookOpen,
  User,
  Plus,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  Headphones,
  Flame,
  Store,
} from "lucide-react";
import { ShopifyLogo } from "./ShopifyLogo";

export const CustomerDashboardMockup: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`w-full bg-white rounded-2xl border border-slate-200/90 shadow-lg text-slate-800 font-sans text-xs overflow-hidden select-none ${className}`}
    >
      <div className="flex min-h-[480px] sm:min-h-[530px]">
        {/* Left Sidebar */}
        <div className="w-52 sm:w-56 bg-slate-50/70 border-r border-slate-200/80 p-3.5 flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="space-y-4">
            {/* User Account Header */}
            <div className="flex items-center gap-2.5 px-2 py-1.5 border-b border-slate-200/60 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                PW
              </div>
              <div className="leading-tight truncate">
                <div className="font-bold text-slate-950 text-xs truncate">
                  E-Commerce Brand
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Shopify verbunden</span>
                </div>
              </div>
            </div>

            {/* Nav Menu */}
            <div className="space-y-0.5 text-[11px]">
              {/* Products (ACTIVE) */}
              <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-xs">
                <div className="flex items-center gap-2.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Products</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-blue-500/80 text-white">
                  2 aktiv
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <span>Product Requests</span>
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                <Boxes className="w-3.5 h-3.5 text-slate-400" />
                <span>Lagerbestand (DE Hub)</span>
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                <span>Orders & Fulfillment</span>
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Retouren (DE Lager)</span>
              </div>

              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sourcing Chat</span>
                </div>
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-blue-100 text-blue-700">
                  Live
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>Shopify Sync</span>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-3 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
            <div className="px-2 py-1 flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>DE Fulfillment Hub:</span>
              <span className="text-emerald-700 font-bold">Online</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-slate-950 cursor-pointer">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Procware Hilfe</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 text-slate-600 hover:text-slate-950 cursor-pointer">
              <Settings className="w-3.5 h-3.5" />
              <span>Einstellungen</span>
            </div>
          </div>
        </div>

        {/* Main Products Content Area */}
        <div className="flex-1 p-4 sm:p-5 bg-white space-y-4 overflow-x-auto">
          {/* Top Bar with Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                  Products
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Shopify Live-Sync aktiv</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Verwalte deine gesourcten Produkte, Lagerbestände und automatisches Shopify Fulfillment.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>Neues Produkt anfragen</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px]">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="SKU oder Produktname suchen..."
                readOnly
                value=""
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium self-end sm:self-auto">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 font-bold cursor-pointer">
                Alle (2)
              </span>
              <span className="px-2.5 py-1 rounded-md hover:bg-slate-50 cursor-pointer">
                Lagerbestand aktiv (2)
              </span>
              <span className="px-2.5 py-1 rounded-md hover:bg-slate-50 cursor-pointer">
                In Nachbestellung (0)
              </span>
            </div>
          </div>

          {/* 2 Two Realistic Product Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {/* Product Card 1: Wireless ANC Headphones */}
            <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/50 to-white p-4 space-y-3.5 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="flex items-start gap-3.5">
                {/* Product Visual Box */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900 flex flex-col items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <Headphones className="w-8 h-8 text-blue-400" />
                  <span className="text-[8px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
                    ANC V3
                  </span>
                  <div className="absolute top-1 right-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 block" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md">
                      <ShopifyLogo className="w-3 h-3" />
                      <span>Shopify Sync</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Fulfillment Aktiv</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 tracking-tight truncate">
                    Nordic Wireless ANC Headphones
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    SKU: PRC-8820-ANC-BLK • Custom Matte Packaging
                  </div>
                </div>
              </div>

              {/* Sourcing Cost & Profit Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Sourcing EK</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">14,80 €</div>
                  <div className="text-[9px] text-slate-400">inkl. QC & DDP</div>
                </div>
                <div className="border-x border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-medium">Shopify VK</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">69,90 €</div>
                  <div className="text-[9px] text-emerald-600 font-bold">+55,10 € DB</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Lager (DE Hub)</div>
                  <div className="text-xs font-black text-blue-700 mt-0.5">1.450 Stk.</div>
                  <div className="text-[9px] text-emerald-600 font-bold">5-8 Tage Express</div>
                </div>
              </div>

              {/* Stock Health Bar & Quick Action */}
              <div className="flex items-center justify-between pt-0.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reichweite: <strong>ca. 42 Tage</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] transition-colors">
                    Nachbestellen (PO)
                  </button>
                </div>
              </div>
            </div>

            {/* Product Card 2: Insulated Smart Bottle */}
            <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/50 to-white p-4 space-y-3.5 hover:border-blue-300 hover:shadow-md transition-all group">
              <div className="flex items-start gap-3.5">
                {/* Product Visual Box */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex flex-col items-center justify-center text-white shrink-0 shadow-xs relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  <Flame className="w-8 h-8 text-emerald-200" />
                  <span className="text-[8px] font-mono text-emerald-100 mt-1 uppercase tracking-wider">
                    750 ML
                  </span>
                  <div className="absolute top-1 right-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 block" />
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-md">
                      <ShopifyLogo className="w-3 h-3" />
                      <span>Shopify Sync</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Fulfillment Aktiv</span>
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 tracking-tight truncate">
                    HydroSmart 750ml Thermoflasche
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono">
                    SKU: PRC-4210-HYD-SLV • Laser Gravur & Eco Box
                  </div>
                </div>
              </div>

              {/* Sourcing Cost & Profit Breakdown Grid */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Sourcing EK</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">4,20 €</div>
                  <div className="text-[9px] text-slate-400">inkl. QC & DDP</div>
                </div>
                <div className="border-x border-slate-200/80">
                  <div className="text-[10px] text-slate-500 font-medium">Shopify VK</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">29,95 €</div>
                  <div className="text-[9px] text-emerald-600 font-bold">+25,75 € DB</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-medium">Lager (DE Hub)</div>
                  <div className="text-xs font-black text-blue-700 mt-0.5">2.850 Stk.</div>
                  <div className="text-[9px] text-emerald-600 font-bold">5-8 Tage Express</div>
                </div>
              </div>

              {/* Stock Health Bar & Quick Action */}
              <div className="flex items-center justify-between pt-0.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reichweite: <strong>ca. 58 Tage</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] transition-colors">
                    Nachbestellen (PO)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Real-Time Sourcing Table */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs">
            <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800">Lagerbestände & Auto-Fulfillment Pipeline</span>
              <span className="text-[10px] text-slate-500 font-medium">Zuletzt synchronisiert: vor 2 Min.</span>
            </div>
            <table className="w-full text-left text-[11px] whitespace-nowrap">
              <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="px-3 py-2">Produkt / SKU</th>
                  <th className="px-3 py-2">Kategorie</th>
                  <th className="px-3 py-2">Lager DE Hub</th>
                  <th className="px-3 py-2">30d Verkäufe</th>
                  <th className="px-3 py-2">Lieferweg</th>
                  <th className="px-3 py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-medium text-slate-900">
                    Nordic Wireless ANC Headphones
                    <span className="block text-[10px] text-slate-400 font-mono">PRC-8820-ANC-BLK</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-500">Consumer Audio</td>
                  <td className="px-3 py-2.5 font-bold text-slate-900">1.450 Stk.</td>
                  <td className="px-3 py-2.5 text-emerald-600 font-bold">1.030 Verkäufe</td>
                  <td className="px-3 py-2.5 text-slate-500">5-8 Werktage (DHL/DPD)</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Optimal
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-medium text-slate-900">
                    HydroSmart 750ml Thermoflasche
                    <span className="block text-[10px] text-slate-400 font-mono">PRC-4210-HYD-SLV</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-500">Home & Living</td>
                  <td className="px-3 py-2.5 font-bold text-slate-900">2.850 Stk.</td>
                  <td className="px-3 py-2.5 text-emerald-600 font-bold">1.470 Verkäufe</td>
                  <td className="px-3 py-2.5 text-slate-500">5-8 Werktage (Hermes/DHL)</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Optimal
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
