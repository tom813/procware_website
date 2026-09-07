import React from "react";
import { Badge } from "./ui/badge";
import { CheckCircle2, ArrowRight, ExternalLink, Calendar } from "lucide-react";

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
                <img
                  src="https://procware.de/wp-content/uploads/2025/06/shopify-app-store.png"
                  alt="Shopify App Store Logo"
                  className="h-5 w-auto object-contain brightness-0 invert"
                  loading="lazy"
                />
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

          {/* Right Column: App Mockup Graphic */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 p-4 shadow-xl">
                <img
                  src="https://procware.de/wp-content/uploads/2025/06/procware-shopify-app.png"
                  alt="Procware Shopify App Ansicht"
                  className="w-full h-auto object-contain rounded-2xl"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
