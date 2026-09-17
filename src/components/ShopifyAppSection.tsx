import React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle2, ArrowRight, ExternalLink, Calendar, Star, ShieldCheck, Zap, RefreshCw, Layers } from "lucide-react";
import { ShopifyLogo } from "./ShopifyLogo";

export const ShopifyAppSection: React.FC = () => {
  return (
    <section id="shopify" className="py-20 sm:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <Badge variant="brand" className="font-bold">Shopify Native App</Badge>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Offiziell verifiziert
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              Entdecke die <span className="text-blue-600">Procware</span> Shopify App
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Verbinde deinen Store in unter 2 Minuten. Keine manuelle Übertragung von Bestelldaten
              oder CSV-Dateien mehr: Deine Verkäufe werden in Echtzeit synchronisiert, von uns verpackt
              und mit Trackingnummer automatisch an deinen Kunden gemeldet.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-800 font-medium">
                  <strong className="font-bold text-slate-950">1-Klick Installation:</strong> Direkt über den offiziellen Shopify App Store einbinden.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-800 font-medium">
                  <strong className="font-bold text-slate-950">Automatisches Fulfillment:</strong> Trackingnummern werden direkt im Shopify-Konto des Kunden hinterlegt.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-800 font-medium">
                  <strong className="font-bold text-slate-950">Transparente Kosten:</strong> 0 € Plattformgebühr bis du deine ersten Bestellungen fulfillment-bereit machst.
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://apps.shopify.com/ltp-ludwig-trading-plattform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Im App Store installieren</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <a
                href="https://calendly.com/team-procware/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-bold rounded-2xl h-12 px-6 border border-slate-300 hover:border-slate-400 text-slate-900 bg-white hover:bg-slate-50 transition-colors"
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Termin buchen</span>
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Shopify Graphic & App Store Showcase */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg">
              <div className="rounded-3xl border border-slate-200/90 bg-slate-950 text-white p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                {/* Background ambient gradient glow */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Top Shopify App Store Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md p-1.5">
                      <ShopifyLogo className="w-full h-full" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Built for Shopify</span>
                      </div>
                      <div className="text-sm font-black text-white">Shopify App Store Partner</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-white">5.0</span>
                    <span className="text-[10px] text-slate-400">(Bewertungen)</span>
                  </div>
                </div>

                {/* App Card Preview */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-black text-white tracking-tight">
                        Procware Sourcing & Fulfillment
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Automatisches Dropshipping & deutsches Lagerfulfillment
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                      Kostenlos installierbar
                    </span>
                  </div>

                  {/* Live Sync Status Row */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span>Order Sync</span>
                      </div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Echtzeit (Webhooks)</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3 text-blue-400" />
                        <span>Tracking-Update</span>
                      </div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>DHL / DPD Auto-Upload</span>
                      </div>
                    </div>
                  </div>

                  {/* Sample Sync Notification Card */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-200">Shopify Order #1048</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Tracking: 003404342890472 (DHL)
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      Erfüllt & Versendet
                    </span>
                  </div>
                </div>

                {/* Bottom Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1 relative z-10 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Keine CSV-Exporte nötig</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>2 Minuten Setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
