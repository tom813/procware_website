import React from "react";
import { PackageCheck, ArrowUpRight } from "lucide-react";

interface ProductSampleCardProps {
  className?: string;
  sku?: string;
  category?: string;
  title?: string;
  description?: string;
  buyPrice?: string;
  sellPrice?: string;
  profit?: string;
  margin?: string;
  stock?: string;
  warehouse?: string;
  image?: string;
  shippingNote?: string;
}

export const ProductSampleCard: React.FC<ProductSampleCardProps> = ({
  className = "",
  sku = "SKU: PRC-4820-ANC",
  category = "Consumer Tech",
  title = "Nordic ANC Wireless Headphones",
  description = "Verhandelt mit zertifiziertem Hersteller • CE & RoHS konform",
  buyPrice = "14,80 €",
  sellPrice = "69,90 €",
  profit = "+55,10 €",
  margin = "78,8% Marge",
  stock = "1.450 Stk.",
  warehouse = "DE Hub Berlin",
  image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
  shippingNote = "Automatisches Same-Day Pick & Pack in Deutschland",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 overflow-hidden text-slate-900 ${className}`}
    >
      {/* Top Status Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-500 font-semibold">{sku}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">{category}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Shopify Sync aktiv</span>
        </div>
      </div>

      {/* Main Product Info & Pricing Row */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Product Image Thumbnail */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 shadow-xs flex items-center justify-center">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-white">
            100% QC
          </div>
        </div>

        {/* Details & Live Pricing Grid */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-base sm:text-lg font-black text-slate-950 tracking-tight leading-snug">
                {title}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {description}
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 shrink-0">
              <span>Aktiv</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Pricing Stats: Einkaufspreis & Rohertrag */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Einkaufspreis
              </div>
              <div className="text-base sm:text-lg font-black text-slate-950 mt-0.5">{buyPrice}</div>
              <div className="text-xs text-slate-500">inkl. Zoll DDP</div>
            </div>

            <div className="bg-emerald-50/70 rounded-xl p-3 border border-emerald-100">
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Rohertrag / Stk.
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-800 mt-0.5">{profit}</div>
              <div className="text-xs text-emerald-600 font-semibold">{margin}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fulfillment Micro Bar */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{shippingNote}</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-slate-800">1-2 Werktage Lieferzeit</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-bold">DHL Tracking</span>
        </div>
      </div>
    </div>
  );
};
